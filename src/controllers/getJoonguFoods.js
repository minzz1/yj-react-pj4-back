export const getJoonguFoods = async (req, res) => {
  console.log("api");
  fetch(
    "https://api.odcloud.kr/api/15052602/v1/uddi:855807e2-fe8a-4e47-8a5a-ce1894e410d7_201909031553?page=1&perPage=10&serviceKey=tmHRWRTW6FWDs2k%2B%2FyLFm%2FKcIuW8SKAoBCPZNuOtAD83W7hto7gTf0rT7b6%2BzBlgPEi9PLeKTYGJUOCCLQO1Kg%3D%3D"
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      res.send(data);
    });
};
