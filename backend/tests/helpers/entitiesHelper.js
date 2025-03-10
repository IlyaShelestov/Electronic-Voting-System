const Event = require("../../src/models/Event");
const Candidate = require("../../src/models/Candidate");
const Election = require("../../src/models/Election");
const Vote = require("../../src/models/Vote");
const City = require("../../src/models/City");
const Region = require("../../src/models/Region");

const createRegion = async (overrides = {}) => {
  try {
    const data = {
      name: "TestRegion",
      ...overrides,
    };
    const region = await Region.create(data);
    return region;
  } catch (error) {
    console.error("Error creating region:", error);
    throw error;
  }
};

const createCity = async (overrides = {}) => {
  try {
    const data = {
      name: "TestCity",
      region_id: 1,
      ...overrides,
    };
    const city = await City.create(data);
    return city;
  } catch (error) {
    console.error("Error creating city:", error);
    throw error;
  }
};

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
      region_id: 1,
      city_id: 1,
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
  createRegion,
  createCity,
  createEvent,
  createElection,
  attachCandidate,
  castVote,
};
