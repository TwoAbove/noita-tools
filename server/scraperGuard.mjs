import { randomBytes } from "crypto";

const maliciousUserAgentParts = [
  "curl",
  "go-http-client",
  "headlesschrome",
  "httpclient",
  "masscan",
  "nikto",
  "nmap",
  "nuclei",
  "nutch",
  "python-",
  "scrapy",
  "sqlmap",
  "wget",
  "zgrab",
];

const suspiciousExtensions =
  /\.(?:7z|action|asmx|ashx|aspx?|bak|bz2|cgi|conf|config|db|do|env|git|gz|ini|jsp|key|lp|lua|lz|old|php\d*|rar|sh|sql|sqlite\d*|sqlitedb|tar|wp|xml|xz|z|zip)(?:$|[/?#])/i;
const suspiciousPaths = [
  "/.aws",
  "/.dbeaver",
  "/.env",
  "/.git",
  "/.maintenance",
  "/_admin",
  "/_phpmyadmin",
  "/accesadministrateur",
  "/admin",
  "/api/dict/getserviceconfig",
  "/api/getwebsiteconfig",
  "/api/imageproxy",
  "/api/index/webconfig",
  "/api/latestsdkconfig",
  "/api/public/",
  "/api/siteconfig",
  "/api/system/systemconfigs",
  "/apiconfig",
  "/app/etc/env",
  "/autodiscover",
  "/backadmin",
  "/backend/.env",
  "/boaform",
  "/boafrm",
  "/cdgserver",
  "/changepassword",
  "/cgi-bin",
  "/client/api/findconfigbykey",
  "/cmsmodules",
  "/config",
  "/dologin",
  "/debug",
  "/docker-compose",
  "/ecp",
  "/eemadminservice",
  "/fcgi-bin",
  "/file/filenologin",
  "/formlogin",
  "/forms/dologin",
  "/getconfig/",
  "/guestlogin",
  "/httpd.conf",
  "/hudson",
  "/iadmin",
  "/jeecg-boot",
  "/jenkins",
  "/jtcgi",
  "/live_check",
  "/login",
  "/management/wizardlogin",
  "/manager/html",
  "/mesh/servlet",
  "/miscadmin",
  "/nginx.conf",
  "/nuclei",
  "/package.json",
  "/pcidss/",
  "/phpmyadmin",
  "/phpinfo",
  "/phpldapadmin",
  "/private/secret",
  "/ps-admin",
  "/public/checklogin",
  "/realms/master/protocol/openid-connect",
  "/rpc2_login",
  "/saconfig",
  "/secret",
  "/secrets",
  "/selecttempconfig",
  "/server-status",
  "/server/service/smsconfig",
  "/services/userregistration",
  "/sftp-config",
  "/share/page/dologin",
  "/shell",
  "/siteconfig",
  "/ssl-vpn",
  "/solr",
  "/sys/dict/",
  "/systemconfig",
  "/telescope",
  "/union select",
  "/user_login_submit",
  "/userlogin",
  "/vendor/phpunit",
  "/webadmin",
  "/webconfig",
  "/web-inf",
  "/webtools/control/xmlrpc",
  "/weaver/",
  "/workflow/servlet",
  "/wp-",
  "/wp/",
  "/xmlrpc",
  "/zentao/",
];

const guidancePaths = new Set(["/robots.txt", "/llms.txt", "/.well-known/llms.txt"]);

const decodePath = value => {
  let decoded = value;

  for (let i = 0; i < 2; i++) {
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) {
        break;
      }
      decoded = next;
    } catch {
      break;
    }
  }

  return decoded;
};

export const isScraperRequest = req => {
  const userAgent = String(req.get("user-agent") || "")
    .trim()
    .toLowerCase();
  const rawPath = req.originalUrl.toLowerCase();
  const decodedPath = decodePath(rawPath);
  const pathname = rawPath.split(/[?#]/, 1)[0];

  if (guidancePaths.has(pathname)) {
    return false;
  }

  if (!userAgent || userAgent === "-" || maliciousUserAgentParts.some(part => userAgent.includes(part))) {
    return true;
  }

  return [rawPath, decodedPath].some(
    path => suspiciousExtensions.test(path) || suspiciousPaths.some(part => path.includes(part)),
  );
};

export const scraperGarbage = () => {
  const id = randomBytes(8).toString("hex");
  return {
    status: "ok",
    id,
    version: `${1 + Math.floor(Math.random() * 9)}.${Math.floor(Math.random() * 100)}.${Math.floor(Math.random() * 100)}`,
    data: randomBytes(24).toString("base64url"),
  };
};

export const scraperGuard = (req, res, next) => {
  if (!isScraperRequest(req)) {
    next();
    return;
  }

  res.status(200);
  res.setHeader("Cache-Control", "no-store");

  if (req.originalUrl.startsWith("/api") || req.accepts(["json", "html"]) === "json") {
    res.json(scraperGarbage());
    return;
  }

  res
    .type("html")
    .send(
      `<!doctype html><html><head><title>${randomBytes(4).toString("hex")}</title></head><body>${randomBytes(32).toString("base64url")}</body></html>`,
    );
};
