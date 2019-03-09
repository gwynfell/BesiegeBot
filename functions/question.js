/* Sends an embed with a question.

   custom data types:
     <answerResolvable> : [<string>, ...], <string>, "CONFIRM"
     <Questionanswer> : { index: <number>, string: <string> }

   Methods:
     <Question>.setTopic(<string>) Sets the title of the embed.
     <Question>.setTime(<Number>) Sets the timeout time in seconds, default: 15.
     <Question>.setIconURL(<string>) Sets the icon, default is a ?.
     <Question>.setQuestion(<string>) Sets the description of the embed.
     <Question>.setColor(<ColorResolvable>) Sets the color of the embed, default is blue.
     <Question>.setUser(<User>) Which user can answer the question, only one.
     <Question>.addanswer(<answerResolvable>) add an answer to the question.
     <Question>.clearanswers goes back to the default "CONFIRM" type.
     <Question>.Setmessage(<Message>) uses this message instead of creating a new one.

     <Question>.askIn(<Channel>, options)
       <Channel> Discord.js channel
       options.forceNew <BOOLEAN>
         - if true creates a new message even if this.message has one.
         - optional
       RETURNS: PROMISE <Questionanswer>

  There are two types of Questions:
    - CONFIRM: yes / no question
    - CHOOSE: choose 1 from a list of answers

  for the yes / no question simply do
    <Question>.addanswer("CONFIRM")
  this is also the default so it can be omited completely.

  for a choose question you simply suply the answers.
    <Question>.addanswer("option 1")
    <Question>.addanswer("option 2")
  You can also add arrays of questions
    <Question>.addanswer(["option 3", "option 4"])
  And you can freely mix these two ways as you see fit.

  You can remove all answers with:
    <Question>.clearanswers()
  Internally this sets this.answers back to "CONFIRM" it never fully wipes
  this.answers as a question should always have an answer.

  EXAMPLE 1, CONFIRM type:

    const question = new Question()
      .setTopic("some topic")
      .setQuestion("some question")
      .setUser(message.author);

    const answer = await question.askIn(message.channel).catch(e => console.log(e));

    const numberOfChosenanswer = answer.index; // undefined
    const theanswerItself = answer.string; // "YES" or "NO"

  EXAMPLE 2, CHOOSE type:

  const quesstion = new Question()
    .setTopic("some topic")
    .setQuestion("some question")
    .addanswer(["answer 1", "answer 2"])
    .addanswer("answer 3")
    .setTime(30)
    .setUser(message.author);

  const answer = await question.askIn(message.channel).catch(e => console.log(e));

  const numberOfChosenanswer = answer.index; // 0 or 1 or 2
  const theanswerItself = answer.string; // "answer 1" or "answer 2" or "answer 3"

*/


const Discord = require("discord.js");

class Question {
  constructor({
    topic,
    iconURL,
    question,
    answers,
    user,
    message,
    color,
    time
  } = {}) {
    this.topic = topic || "";
    this.iconURL = iconURL || "https://i.imgur.com/Na9Cj8U.png";
    this.question = question || "";
    this.answers = answers || "CONFIRM"; // "CONFRIM" or array of strings NOTHING ELSE!
    this.user = user || undefined;
    this.message = message || undefined;
    this.color = color || 2471891;
    this.time = time || 15; // seconds
    return this;
  }

  setTopic(topic) {
    if (typeof topic !== "string") throw new TypeError("Topic is not a string");
    this.topic = topic;
    return this;
  }

  setIconURL(iconURL) {
    if (typeof iconURL !== "string") throw new TypeError("iconURL is not a string");
    this.iconURL = iconURL;
    return this;
  }

  setQuestion(question) {
    if (typeof question !== "string") throw new TypeError("question is not a string");
    this.question = question;
    return this;
  }

  setUser(user) {
    if (!(user instanceof Discord.User)) throw new TypeError("user is not a Discord.js <User>");
    this.user = user;
    return this;
  }

  setMessage(message) {
    if (!message) return this;
    if (!(message instanceof Discord.Message)) throw new TypeError("message is not a Discord.js <Message>");
    this.message = message;
    return this;
  }

  setColor(color) {
    // No error checks, add in later.
    this.color = color;
    return this;
  }

  setTime(time) {
    if (typeof time !== "number") throw new TypeError("time is not a number");
    this.time = time;
    return this;
  }

  addAnswer(answer) {
    if (typeof answer !== "string" && !Array.isArray(answer)) throw new TypeError("answer is not a string, nor an array");
    if (typeof answer === "string" && answer !== "CONFIRM") answer = [answer];
    if (this.answers === "CONFIRM" || answer === "CONFIRM") {
      this.answers = answer;
    }
    else {
      this.answers = [...new Set([...this.answers, ...answer])];
    }
    return this;
  }

  clearAnswers() {
    this.answers = "CONFIRM";
    return this;
  }

  async askIn(channel, { forceNew = false } = {}) {
    return new Promise(async (resolve, reject) => {
      const emojiLUT = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣", "🔟", "🇾", "🇳"];
      let emojis = ["❌"];
      let content;

      if (!(this.message instanceof Discord.Message) || forceNew === true) {
        this.message = await channel.send("🔄  |  Loading interface...");
      }

      const embed = new Discord.RichEmbed()
        .setColor(this.color)
        .setAuthor(this.topic, this.iconURL);

      if (this.answers === "CONFIRM") {
        emojis = emojis.concat(emojiLUT.slice(-2)); // Fill emoji array with Y and N.
        content = this.question;
      }
      else {
        if (!Array.isArray(this.answers)) throw new TypeError("<Question>.answers is not an array, nor is it \"CONFIRM\"");
        if (this.answers.length > 10) throw new RangeError("<Question>.answers contains more than 10 elements");
        emojis = emojis.concat(emojiLUT.slice(0, this.answers.length));
        content = [
          this.question,
          ...this.answers.map((a, i) => `${emojiLUT[i]}  |  ${a}`)
        ];
      }

      embed.setDescription(content);

      if (!(channel instanceof Discord.TextChannel)) throw new TypeError("channel is not a Discord.js <TextChannel>");
      this.message.edit(embed);

      try {
        // for (let emote in emojis) {
        //   await this.message.react(emote);
        // }
        for (let i = 0; i < emojis.length; i++) {
          await this.message.react(emojis[i]);
        }
      }
      catch (err) {
        return reject(new Error("One of the emojis failed to react"));
      }

      if (!(this.user instanceof Discord.User)) throw new TypeError("this.user is not a Discord.js <User>");
      const collection = await this.message.awaitReactions(
        (r, u) => emojis.includes(r.emoji.name) && u.id === this.user.id,
        { max: 1, time : this.time * 1000 }
      );

      await this.message.clearReactions();

      if (!collection.first()) return reject(new Error("No reactions detected, this interface timed out."));
      switch (collection.first().emoji.name) {
      case "❌":
        return reject(new Error("Interface aborted"));
      case "🇾":
        return resolve({ index: undefined, string: "YES" });
      case "🇳":
        return resolve({ index: undefined, string: "NO" });
      default:
        return resolve({
          index: emojiLUT.indexOf(collection.first().emoji.name),
          string: this.answers[emojiLUT.indexOf(collection.first().emoji.name)]
        });
      }
    });
  }
}

module.exports = Question;
