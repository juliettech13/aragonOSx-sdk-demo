export function ETHToWei(ETHAmount: number): bigint {
  return BigInt(ETHAmount * 10 ** 18);
}
