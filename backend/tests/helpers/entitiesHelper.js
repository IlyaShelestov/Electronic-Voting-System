const Event = require("../../src/models/Event");
const Candidate = require("../../src/models/Candidate");
const Election = require("../../src/models/Election");
const Vote = require("../../src/models/Vote");

const createEvent = async (overrides = {}) => {
  try {
    const data = {
      title: "TestTitle",
      description: "TestDescription",
      event_date: "2021-01-01",
      ...overrides,
    };
    const event = await Event.create(data);
    return event;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

const createElection = async (overrides = {}) => {
  try {
    const data = {
      title: "TestTitle",
      start_date: "2021-01-01",
      end_date: "2021-01-08",
      region: "TestRegion",
      city: "TestCity",
      ...overrides,
    };
    const election = await Election.create(data);
    return election;
  } catch (error) {
    console.error("Error creating election:", error);
    throw error;
  }
};

const attachCandidate = async (
  electionId = 1,
  candidateId = 1,
  overrides = {}
) => {
  try {
    const data = {
      election_id: electionId,
      candidate_id: candidateId,
      ...overrides,
    };
    const candidate = await Candidate.attachToElection(
      data.candidate_id,
      data.election_id
    );

    return candidate;
  } catch (error) {
    console.error("Error attaching candidate:", error);
    throw error;
  }
};

const castVote = async (
  token = "123",
  electionId = 1,
  candidateId = 1,
  userId = 1
) => {
  try {
    const data = {
      electionId,
      candidateId,
      userId,
      token,
    };
    const vote = await Vote.cast(data);
    return vote;
  } catch (error) {
    console.error("Error casting vote:", error);
    throw error;
  }
};

module.exports = {
  createEvent,
  createElection,
  attachCandidate,
  castVote,
};
