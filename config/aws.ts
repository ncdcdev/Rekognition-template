import AWS from "aws-sdk";

AWS.config.update({
  region: "ap-northeast-1",
  // accessKeyId: process.env.AWS_ACESS_KEY_ID,
  // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export default AWS;
