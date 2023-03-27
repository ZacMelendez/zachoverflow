const { deletePost } = require('../helpers/blogposts');
require('dotenv').config()

const handler = async (event) => {
  let response

  const { url } = JSON.parse(event.body)
  await deletePost(url)

  try {
    response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*", // Allow from anywhere 
        "Access-Control-Allow-Methods": "GET" // Allow only GET request 
      },
      body: JSON.stringify({
        status: "Success"
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