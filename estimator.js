const covid19ImpactEstimator = (data) => {
  const {
    region, periodType, timeToElapse, reportedCases, totalHospitalBeds
  } = data;

  const outPut = {
    data,
    impact: {},
    severeImpact: {}
  };

  const currentlyInfected = (factor) => Math.trunc(reportedCases * factor);

  // compute timeFrame in days
  const weeks = 'weeks';
  const months = 'months';

  const getTimeFrame = (period, pType) => {
    switch (pType) {
      case months:
        return period * 30;
      case weeks:
        return period * 7;
      default:
        return period;
    }
  };

  const timeFrame = getTimeFrame(timeToElapse, periodType);

  const infectionsByRequestedTime = (infected, actualTime) => {
    const multiplier = (2 ** Math.floor(actualTime / 3));
    // const multiplier = (2 ** Math.trunc(actualTime / 3));

    const infectiosByTime = Math.trunc(infected * multiplier);
    return (infectiosByTime);
  };

  const current = Math.trunc(currentlyInfected(10));
  const severe = Math.trunc(currentlyInfected(50));
  outPut.impact.currentlyInfected = current;
  outPut.severeImpact.currentlyInfected = severe;

  outPut.impact.infectionsByRequestedTime = (
    Math.trunc(infectionsByRequestedTime(current, timeFrame))
  );
  outPut.severeImpact.infectionsByRequestedTime = (
    Math.trunc(infectionsByRequestedTime(severe, timeFrame))
  );

  // Challenge 2

  outPut.impact.severeCasesByRequestedTime = (
    Math.trunc(outPut.impact.infectionsByRequestedTime * 0.15)
  );
  outPut.severeImpact.severeCasesByRequestedTime = (
    outPut.severeImpact.infectionsByRequestedTime * 0.15
  );

  const totalHospitalBedsAvailable = 0.35 * totalHospitalBeds;
  outPut.impact.hospitalBedsByRequestedTime = (
    Math.trunc(totalHospitalBedsAvailable - outPut.impact.severeCasesByRequestedTime)
  );
  outPut.severeImpact.hospitalBedsByRequestedTime = (
    Math.trunc(totalHospitalBedsAvailable - outPut.severeImpact.severeCasesByRequestedTime)
  );

  // Challenge 3

  outPut.impact.casesForICUByRequestedTime = (
    Math.trunc(outPut.impact.infectionsByRequestedTime * 0.05)
  );
  outPut.severeImpact.casesForICUByRequestedTime = (
    Math.trunc(outPut.severeImpact.infectionsByRequestedTime * 0.05)
  );

  outPut.impact.casesForVentilatorsByRequestedTime = (
    Math.trunc(outPut.impact.infectionsByRequestedTime * 0.02)
  );
  outPut.severeImpact.casesForVentilatorsByRequestedTime = (
    Math.trunc(outPut.severeImpact.infectionsByRequestedTime * 0.02)
  );

  outPut.impact.dollarsInFlight = (
    Math.trunc((outPut.impact.infectionsByRequestedTime * region.avgDailyIncomePopulation
          * region.avgDailyIncomeInUSD) / timeFrame)
  );
  outPut.severeImpact.dollarsInFlight = (
    Math.trunc((outPut.severeImpact.infectionsByRequestedTime * region.avgDailyIncomePopulation
          * region.avgDailyIncomeInUSD) / timeFrame)
  );

  /*
  const {
    region, periodType, timeToElapse, reportedCases, totalHospitalBeds
  } = data;

  const outPut = {
    data,
    impact: {},
    severeImpact: {}
  };

  const currentlyInfected = (factor) => reportedCases * factor;

  // compute timeFrame in days
  // const days = 'days'
  const weeks = 'weeks';
  const months = 'months';

  const getTimeFrame = (period) => {
    switch (periodType) {
      case months:
        return period * 30;
      case weeks:
        return period * 7;
      default:
        return period;
    }
  };

  const timeFrame = getTimeFrame(timeToElapse, periodType);

  const infectionsByRequestedTime = (infected, actualTime) => {
    const multiplier = (2 ** Math.floor(actualTime / 3));
    // const multiplier = (2 ** Math.trunc(actualTime / 3));

    const infectiosByTime = Math.trunc(infected * multiplier);
    return (infectiosByTime);
  };

  const current = Math.trunc(currentlyInfected(10));
  const severe = Math.trunc(currentlyInfected(50));
  // outPut.impact.currentlyInfected = currentlyInfected(10);
  // outPut.severeImpact.currentlyInfected = currentlyInfected(50);
  outPut.impact.currentlyInfected = current;
  outPut.severeImpact.currentlyInfected = severe;

  outPut.impact.infectionsByRequestedTime = infectionsByRequestedTime(current, timeFrame);
  outPut.severeImpact.infectionsByRequestedTime = infectionsByRequestedTime(severe, timeFrame);

  // Challenge 2

  outPut.impact.severeCasesByRequestedTime = outPut.impact.infectionsByRequestedTime * 0.15;
  outPut.severeImpact.severeCasesByRequestedTime = (
    outPut.severeImpact.infectionsByRequestedTime * 0.15
  );

  outPut.impact.hospitalBedsByRequestedTime = (
    Math.ceil(0.35 * totalHospitalBeds) - outPut.impact.severeCasesByRequestedTime
  );
  outPut.severeImpact.hospitalBedsByRequestedTime = (
    Math.ceil(0.35 * totalHospitalBeds) - outPut.severeImpact.severeCasesByRequestedTime
  );

  // Challenge 3

  outPut.impact.casesForICUByRequestedTime = (
    Math.trunc(outPut.impact.infectionsByRequestedTime * 0.05)
  );
  outPut.severeImpact.casesForICUByRequestedTime = (
    Math.trunc(outPut.severeImpact.infectionsByRequestedTime * 0.05)
  );

  outPut.impact.casesForVentilatorsByRequestedTime = (
    Math.trunc(outPut.impact.infectionsByRequestedTime * 0.02)
  );
  outPut.severeImpact.casesForVentilatorsByRequestedTime = (
    Math.trunc(outPut.severeImpact.infectionsByRequestedTime * 0.02)
  );

  outPut.impact.dollarsInFlight = (
    Math.trunc((outPut.impact.infectionsByRequestedTime * region.avgDailyIncomePopulation
        * region.avgDailyIncomeInUSD) / timeFrame)
  );
  outPut.severeImpact.dollarsInFlight = (
    Math.trunc((outPut.severeImpact.infectionsByRequestedTime * region.avgDailyIncomePopulation
        * region.avgDailyIncomeInUSD) / timeFrame)
  );  
  */

 return outPut;
};

//export default covid19ImpactEstimator;
module.exports = covid19ImpactEstimator;
