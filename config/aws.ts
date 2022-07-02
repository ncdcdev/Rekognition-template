import AWS from "aws-sdk";

AWS.config.update({
  region: "ap-northeast-1",
});

export default AWS