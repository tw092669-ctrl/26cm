// 测试倍率函数
const getMainMultiplier = (level) => {
  if (level <= 0) return 0;
  if (level <= 5) return 400;
  if (level <= 9) return 520;
  if (level === 10) return 640;
  if (level <= 12) return 700;
  return 760;
};

console.log('测试主战倍率:');
for (let i = 0; i <= 15; i++) {
  console.log(`Level ${i}: ${getMainMultiplier(i)}%`);
}
