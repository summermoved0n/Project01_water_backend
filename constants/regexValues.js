const PASSWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,64})/;
const DATE_REGEX =
  /^(?:19[0-9][0-9]|20[0-9][0-9])-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])$/;

export { PASSWD_REGEX, DATE_REGEX };
