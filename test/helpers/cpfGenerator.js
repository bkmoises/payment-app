const mockCpf = () => {
  const randomNumber = () => Math.floor(Math.random() * 10);

  const cpfArray = Array.from({ length: 9 }, randomNumber);

  const d1 =
    cpfArray.reduce((acc, digit, index) => acc + digit * (index + 1), 0) % 11;
  cpfArray.push(d1 < 10 ? d1 : 0);

  const d2 =
    cpfArray.reduce((acc, digit, index) => acc + digit * index, 0) % 11;
  cpfArray.push(d2 < 10 ? d2 : 0);

  const cpf = cpfArray
    .join("")
    .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

  return cpf;
};

module.exports = mockCpf;
