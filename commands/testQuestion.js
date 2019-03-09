const Question = require("../functions/question.js");

// async run(message, args, settings) { // eslint-disable-line no-unused-vars
exports.run = async (bot, message, args) => { // eslint-disable-line
  const choice = await askQuestion();

  if (choice) bot.send.success(`your choice was: \n\`${choice.index}: ${choice.string}\``, message.channel);

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
      .setUser(message.author)
      .setMessage(editMsg);

    const answer = await question.askIn(message.channel).catch(err => {
      question.message.delete();
      bot.send.error(err.message, message.channel);
    });

    if (!answer) return;

    const confirm = new Question()
      .setTopic("confirm test")
      .setQuestion(`Are you sure you want to choose:\n\`${answer.index}: ${answer.string}\``)
      .setUser(message.author)
      .setMessage(question.message);

    const confirmAnswer = await confirm.askIn(message.channel).catch(err => {
      question.message.delete();
      bot.send.error(err.message, message.channel);
    });

    if (!confirmAnswer) return;

    switch (confirmAnswer.string) {
    case "YES": {
      confirm.message.delete();
      return answer;
    }
    case "NO": return askQuestion(confirm.message);
    }
  }
};

exports.conf = {
  permLevel: 0,
  aliases: []
};

exports.help = {
  name: "testQuestion",
  description: "All hail the hammer master race",
  usage: "hmr :: shows a random bot from the hammer master race"
};
