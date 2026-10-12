const drawBtn = document.querySelector("#draw-btn");
const pokemonImg = document.querySelector("#pokemon-img");
const statusText = document.querySelector("#status-text");
const dexCount = document.querySelector("#dex-count");
const pokedex = JSON.parse(localStorage.getItem("pokedex")) || [];
dexCount.textContent = pokedex.length;

//중복 없는 배열
drawBtn.addEventListener("click", async function () {
  const pokelist = [];
  for (let i = 1; i <= 151; i++) {
    if (pokedex.indexOf(i) === -1) pokelist.push(i);
  }

  //다 뽑았을때
  if (pokelist.length === 0) {
    statusText.textContent = "도감 완성! (151/151)";
    return;
  }

  //남은 포켓몬 중 하나 뽑기
  const pokeId = pokelist[Math.floor(Math.random() * pokelist.length)];

  //연타 방지, 다시 몬스터볼로 돌리기, 볼 흔들림, 가챠 진행글
  drawBtn.disabled = true;
  pokemonImg.src = "몬스터볼.webp";
  pokemonImg.classList.add("shake");
  statusText.textContent = "볼을 던지는 중...";

  //문제 생겨도 프로그램 멈추지 않게하기
  try {
    const res = await fetch(
      "https://pokeapi.co/api/v2/pokemon-species/" + pokeId,
    );
    if (!res.ok) throw new Error();
    const data = await res.json();

    //한국어 이름 찾기
    const koItem = data.names.find(function (item) {
      return item.language.name === "ko";
    });

    //흔들림 1.5초
    await new Promise(function (resolve) {
      setTimeout(resolve, 1500);
    });

    // 움직이는 GIF
    pokemonImg.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/" +
      pokeId +
      ".gif";
    pokedex.push(pokeId);
    localStorage.setItem("pokedex", JSON.stringify(pokedex));
    dexCount.textContent = pokedex.length;

    statusText.textContent =
      "[No." + pokeId + "] " + koItem.name + "을(를) 잡았다!";
  } catch (error) {
    statusText.textContent = "가챠 중 오류가 발생했습니다.";
  } finally {
    pokemonImg.classList.remove("shake");
    drawBtn.disabled = false;
  }
});
