const { putPost } = require('../helpers/blogposts');
require('dotenv').config()

const handler = async (event) => {
  let response

  const blog = JSON.parse(event.body)
  const post = await putPost(blog)

  try {
    response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*", // Allow from anywhere 
        "Access-Control-Allow-Methods": "GET" // Allow only GET request 
      },
      body: JSON.stringify({
        content: "Success"
      })
    };
  } catch (err) {
    console.log(err);
    response = {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*", // Allow from anywhere 
        "Access-Control-Allow-Methods": "GET" // Allow only GET request 
      },
      body: JSON.stringify({
        message: err instanceof Error ? err.message : 'some error happened'
      })
    };
  }

  return response;
};

exports.handler = handler