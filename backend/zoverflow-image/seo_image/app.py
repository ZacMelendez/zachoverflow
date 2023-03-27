import json
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))

from helpers.create_image import create_image
from helpers.upload_image import upload_to_aws


def lambda_handler(event: dict, context) -> dict:
    print(event)
    if event["httpMethod"] != "POST":
        return {
            "statusCode": 405,
            "body": json.dumps({"message": "method not allowed"}),
        }

    body = json.loads(event["body"])

    if ("title" not in body) or ("id" not in body):
        return {
            "statusCode": 400,
            "body": json.dumps(
                {"message": "please include the 'title' and 'id' keys in the body"}
            ),
        }

    id = body["id"]
    title = body["title"]

    img = create_image(title)

    upload_to_aws(img, id)

    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "message": f"succesfully uploaded image: images/{id}/splash.png",
            }
        ),
    }
