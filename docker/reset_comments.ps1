
aws dynamodb create-table --table-name zachoverflow-comments --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --endpoint-url http://localhost:8000
^C