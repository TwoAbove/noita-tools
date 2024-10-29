export const isDev = () => {
  const host = window.location.host;
  return import.meta.env.MODE === "development" || host === "dev.noitool.com" || isLocal();
};

export const isLocal = () => {
  return Boolean(
    window.location.hostname === "localhost" ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === "[::1]" ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/),
  );
};

// Used for matching urls like /test
export const isFullPath = (target: string) => {
  return window.location.pathname === target;
};
