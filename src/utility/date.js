// import { STATS_TYPE } from "@/config/constants";
import moment from "moment-timezone";
const getDate = () => {
  return new Date();
};

const getMidNightDateStr = () => {
  const dateString = moment()
    .tz("Asia/Kolkata")
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    .format("DD/MM/YYYY");
  const dateMomentObject = moment(dateString, "DD/MM/YYYY"); // 1st argument - string, 2nd argument - format
  return dateMomentObject.toDate();
};

const getDateForTimezone = (dt, timezone) => {
  const dateString = moment(dt)
    .tz(timezone)
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    .format("DD/MM/YYYY");
  const dateMomentObject = moment(dateString, "DD/MM/YYYY"); // 1st argument - string, 2nd argument - format
  return dateMomentObject.toDate();
};

export default {
  getDate,
  getMidNightDateStr,

  getDateForTimezone,
};
