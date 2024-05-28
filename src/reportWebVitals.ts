import { get } from "lodash";
import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals/attribution";

const waitForResponse = (fn: Function, cb: Function) => {
  return new Promise(resolve => {
    fn(data => {
      cb(data);
      resolve(data);
    });
  });
};

const reportWebVitals = async (onPerfEntry?: any) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    const out = {};
    await Promise.allSettled([
      waitForResponse(onCLS, data => {
        out["CLS"] = data;
      }),
      waitForResponse(onFCP, data => {
        out["FCP"] = data;
      }),
      waitForResponse(onLCP, data => {
        out["LCP"] = data;
      }),
      waitForResponse(onTTFB, data => {
        out["TTFB"] = data;
      }),
      waitForResponse(onINP, data => {
        out["INP"] = data;
      }),
    ]);
    return out;
  }
};

export default reportWebVitals;
