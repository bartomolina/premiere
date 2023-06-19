export const truncateAddr = (address: string, separator: string = "…") => {
  const match = address.match(
    /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/
  );

  if (!match) return address;
  return `${match[1]}${separator}${match[2]}`;
};
