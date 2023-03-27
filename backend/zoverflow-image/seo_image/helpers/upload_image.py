import boto3
from botocore.exceptions import NoCredentialsError
import os
import io
from PIL import Image

AWS_ACCESS_KEY = os.environ["ACCESS_KEY"]
AWS_SECRET_KEY = os.environ["SECRET_KEY"]


def upload_to_aws(img: Image.Image, id: str):
    s3 = boto3.client(
        "s3", aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY
    )
    in_mem_file = io.BytesIO()
    img.save(in_mem_file, format="png")
    in_mem_file.seek(0)
    try:
        # s3.upload_file(local_file, bucket, s3_file)
        print(
            s3.upload_fileobj(
                in_mem_file,
                "zachoverflow",
                f"images/{id}/splash.png",
                ExtraArgs={"ACL": "public-read", "ContentType": "image/png"},
            )
        )
        print("Upload Successful")
        return True
    except FileNotFoundError:
        print("The file was not found")
        return False
    except NoCredentialsError:
        print("Credentials not available")
        return False
