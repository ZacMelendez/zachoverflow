#!/usr/bin/python3

# -----------------------------------------------------------
# crawls through an OPCUA server under a given node and returns a .json
# file as an output as well as a list of all the non-extension nodes
#
# email zacmelendez@gmail.com
# -----------------------------------------------------------

from datetime import datetime
from asyncua import Client, Node
import asyncio
import json
from collections import deque
from argparse import ArgumentDefaultsHelpFormatter, ArgumentParser

parser = ArgumentParser(
    description="Python 3.9 function used to crawl OPCUA servers and return a .json file which can be used with OPCPublisher",
    formatter_class=ArgumentDefaultsHelpFormatter,
)
parser.add_argument(
    "-m",
    "--max_nodes",
    help="Max number of nodes to search through",
    default=50_000,
    type=int,
)
parser.add_argument("-v", "--verbose", help="Increase verbosity", default=False)
parser.add_argument(
    "-n", "--node", help="Name of top-level node to check under", type=str
)
parser.add_argument(
    "-o", "--output", help="File location", default="./output.json", type=str
)
parser.add_argument("--host", help="Host IP address", type=str)
parser.add_argument("--port", help="Host port", default=4840, type=int)
parser.add_argument("-u", "--username", help="Destination username", type=str)
parser.add_argument("-p", "--password", help="Destination password", type=str)
parser.add_argument(
    "-e",
    "--exclude",
    help="List of nodes to ignore, will automatically include any nodes underneath if the specified node is an ExtensionObject. Enter as a comma separated list, i.e. 'nodeId1,nodeId2,nodeId3'",
    type=str,
)
parser.add_argument(
    "--separator",
    help="Character used to separate structures in your OPCUA Server",
    default="/",
    type=str,
)


args = parser.parse_args()
config = vars(args)


class NodeStack:
    def __init__(self):
        self.node_stack = deque()
        self.data = {}
        self.node_stack.append(self.data)

    def __str__(self):
        return f"{self.data}"

    def pushNode(self, nodeName):
        node = self.currentNode().setdefault(nodeName, {})
        self.node_stack.append(node)
        return node

    def currentNode(self):
        return self.node_stack[-1]

    def popNode(self):
        return self.node_stack.pop()

    def setValue(self, key, val):
        self.currentNode()[key] = val
        return self.currentNode()

    def getValue(self, key, default=None):
        return self.currentNode().get(key, default)


async def collect_all_under(node: Node, collect_maximum=config["max_nodes"]):
    all_nodes = []
    unsearched = [node]
    nodeData = NodeStack()
    valueNodes = []

    while unsearched and len(all_nodes) < collect_maximum:
        child = unsearched.pop()
        nodeId = str(child)

        if ("#EURange" in nodeId) or ("#EuRangeViolation" in nodeId):
            continue

        if (
            config["exclude"]
            and len(
                list(
                    filter(
                        lambda key: key.strip() in nodeId, config["exclude"].split(",")
                    )
                )
            )
            > 0
        ):
            continue

        all_nodes.append(child)

        parent = config["separator"].join(nodeId.split(config["separator"])[:-1])

        try:
            dataType = str(await child.read_data_type_as_variant_type()).split(".")[1]

        except Exception:
            dataType = await node.read_node_class()
            if str(dataType) == "NodeClass.Object":
                dataType = "ExtensionObject"

        children = await child.get_children()

        if dataType == "ExtensionObject":
            if parent == "":
                nodeData.pushNode(nodeId)
            else:
                if [*nodeData.currentNode().keys()] == []:
                    nodeData.pushNode(nodeId)
                else:
                    ns_parent = config["separator"].join(
                        [*nodeData.currentNode().keys()][0].split(config["separator"])[
                            :-1
                        ]
                    )
                    while ns_parent != parent:
                        nodeData.popNode()
                        ns_parent = config["separator"].join(
                            [*nodeData.currentNode().keys()][0].split(
                                config["separator"]
                            )[:-1]
                        )
                    nodeData.pushNode(nodeId)

        else:
            nodeData.setValue(nodeId, {"dataType": dataType})
            valueNodes.append(
                {
                    "Id": nodeId,
                    "OpcSamplingInterval": 1000,
                    "OpcPublishingInterval": 5000,
                }
            )

        unsearched.extend(children)

    return all_nodes, nodeData, valueNodes


async def main():
    auth = (
        f'{config["username"]}:{config["password"]}@'
        if config["username"] and config["password"]
        else ""
    )
    url = f'opc.tcp://{auth}{config["host"]}:{config["port"]}/'
    nodeid = config["node"]
    async with Client(url=url) as client:
        node = client.get_node(nodeid)

        start = datetime.now()
        nodes_found, nodeData, valueNodes = await collect_all_under(node)
        duration = datetime.now() - start
        count = len(nodes_found)
        rate = count / duration.total_seconds()

        opc_server = {
            "EndpointUrl": f"opc.tcp://{config['host']}:{config['port']}",
        }

        if config["username"] and config["password"]:
            opc_server = {
                **opc_server,
                "UseSecurity": True,
                "OpcAuthenticationMode": "UsernamePassword",
                "OpcAuthenticationUsername": f"{config['username']}",
                "OpcAuthenticationPassword": f"{config['password']}",
                "OpcNodes": valueNodes,
            }
        else:
            opc_server = {
                **opc_server,
                "UseSecurity": False,
                "OpcNodes": valueNodes,
            }

        with open(f'{config["output"]}', "w") as file:
            file.write(json.dumps(nodeData.data))

        with open("./published_nodes.json", "w") as file:
            file.write(json.dumps([opc_server]))

        print("Found {} nodes in {} ({} per second)".format(count, duration, rate))

        return nodes_found


if __name__ == "__main__":
    asyncio.run(main())
