const Question = require("../functions/question.js");

// async run(message, args, settings) { // eslint-disable-line no-unused-vars
exports.run = async (client, msg, args) => { // eslint-disable-line
  const choice = await askQuestion();

  if (choice) client.send.success(`your choice was: \n\`${choice.index}: ${choice.string}\``, msg.channel);

  async function askQuestion(editMsg = undefined) {
    const options = [
      "option 1",
      "option 2",
      "option 3"
    ];

    const question = new Question()
      .setTopic("choose test")
      .setQuestion("Choose one of the following")
      .addAnswer(options)
      .addAnswer("option 4")
      .setTime(30)
      .setUser(msg.author)
      .setMessage(editMsg);

    const answer = await question.askIn(msg.channel).catch(err => {
      question.msg.delete();
      client.send.error(err.message, msg.channel);
    });

    if (!answer) return;

    const confirm = new Question()
      .setTopic("confirm test")
      .setQuestion(`Are you sure you want to choose:\n\`${answer.index}: ${answer.string}\``)
      .setUser(msg.author)
      .setMessage(question.message);

    const confirmAnswer = await confirm.askIn(msg.channel).catch(err => {
      question.msg.delete();
      client.send.error(err.message, msg.channel);
    });

    if (!confirmAnswer) return;

    switch (confirmAnswer.string) {
    case "YES": {
      confirm.msg.delete();
      return answer;
    }
    case "NO": return askQuestion(confirm.message);
    }
  }
};

exports.conf = {
  name: "testQuestion",
  permLevel: 0,
  aliases: [],
  description: "All hail the hammer master race",
  usage: "hmr :: shows a random bot from the hammer master race"
};
