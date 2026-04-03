import leoProfanity from 'leo-profanity';

function sanitiseProfanity(reply) {
  return leoProfanity.clean(reply);
}

const exports = {
  sanitiseProfanity: sanitiseProfanity
};

export {
  exports as default
};
