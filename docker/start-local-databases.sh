#!/bin/zsh

docker compose up -d

{
    AWS_PAGER="" aws dynamodb delete-table --table-name zachoverflow-comments --endpoint-url http://localhost:8000 && AWS_PAGER="" aws dynamodb create-table --table-name zachoverflow-comments --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --endpoint-url http://localhost:8000

} || {
    AWS_PAGER="" aws dynamodb create-table --table-name zachoverflow-comments --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --endpoint-url http://localhost:8000
}

{
    AWS_PAGER="" aws dynamodb delete-table --table-name zachoverflow-posts --endpoint-url http://localhost:8000 && AWS_PAGER="" aws dynamodb create-table --table-name zachoverflow-posts --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --attribute-definitions AttributeName=url,AttributeType=S --key-schema AttributeName=url,KeyType=HASH --endpoint-url http://localhost:8000

} || {
    AWS_PAGER="" aws dynamodb create-table --table-name zachoverflow-posts --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --attribute-definitions AttributeName=url,AttributeType=S --key-schema AttributeName=url,KeyType=HASH --endpoint-url http://localhost:8000
}

{
    AWS_PAGER="" aws s3api delete-bucket --bucket zachoverflow --endpoint-url http://localhost:4566 && AWS_PAGER="" aws s3api create-bucket --bucket zachoverflow --endpoint-url http://localhost:4566

} || {
    AWS_PAGER="" aws s3api create-bucket --bucket zachoverflow --endpoint-url http://localhost:4566
}
