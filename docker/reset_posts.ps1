aws dynamodb delete-table --table-name zachoverflow-posts --endpoint-url http://localhost:8000
aws dynamodb create-table --table-name zachoverflow-posts --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --attribute-definitions AttributeName=url,AttributeType=S --key-schema AttributeName=url,KeyType=HASH --endpoint-url http://localhost:8000
