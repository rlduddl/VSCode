let storeIds = JSON.parse(localStorage.getItem("favoriteStores")) || [];
const API_KEY = "78a4b456e0a19ac893591fb5dc67d523"; // JavaScript key

kakao.maps.load(() => {
  initMap();
  updateFavoriteList();
});

// 지도 초기화 함수
function initMap() {
  const mapContainer = document.getElementById("map");
  const mapOptions = {
    center: new kakao.maps.LatLng(33.450701, 126.570667), // 기본 중심 좌표
    level: 3, // 확대 레벨
  };
  new kakao.maps.Map(mapContainer, mapOptions);
}

function searchStores() {
  const query = document.getElementById("storeQuery").value.trim();
  const searchResults = document.getElementById("searchResults");
  const mapHeader = document.getElementById("mapHeader");
  const mapDiv = document.getElementById("map");
  searchResults.innerHTML = ""; // 이전 검색 결과 초기화

  if (!query) {
    alert("검색어를 입력하세요.");
    return;
  }

  fetch(
    `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(
      query
    )}`,
    {
      headers: {
        Authorization: `KakaoAK ${API_KEY}`, // 공백 확인
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (!data.documents || data.documents.length === 0) {
        alert("검색 결과가 없습니다.");
        mapHeader.classList.add("hidden");
        mapDiv.classList.add("hidden");
        return;
      }

      // 검색 결과가 있을 경우
      mapHeader.classList.remove("hidden");
      mapDiv.classList.remove("hidden");

      data.documents.forEach((store) => {
        const li = document.createElement("li");
        li.textContent = `${store.place_name} - ${store.address_name}`;
        li.onclick = () => {
          showLocation(store.address_name);
          selectedStore = store.place_name;
          document.getElementById("storeId").value = selectedStore;
          document
            .getElementById("addFavoriteBtn")
            .scrollIntoView({ behavior: "smooth" });
        };

        searchResults.appendChild(li);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("가게 검색에 실패했습니다: " + error.message);
    });
}

// 주소로 위치 표시
function showLocation(address) {
  const mapContainer = document.getElementById("map");
  const mapOptions = {
    center: new kakao.maps.LatLng(33.450701, 126.570667),
    level: 3,
  };
  const map = new kakao.maps.Map(mapContainer, mapOptions);
  const geocoder = new kakao.maps.services.Geocoder();

  geocoder.addressSearch(address, function (result, status) {
    if (status === kakao.maps.services.Status.OK) {
      const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
      const marker = new kakao.maps.Marker({ map: map, position: coords });
      const infowindow = new kakao.maps.InfoWindow({
        content: `<div style="width:150px;text-align:center;padding:6px 0;">${address}</div>`,
      });
      infowindow.open(map, marker);
      map.setCenter(coords);
    }
  });
}

// 즐겨찾기 추가
function addFavorite() {
  if (selectedStore && !storeIds.includes(selectedStore)) {
    storeIds.push(selectedStore);
    localStorage.setItem("favoriteStores", JSON.stringify(storeIds));
    updateFavoriteList();
    alert(`Store ${selectedStore} has been added to favorites.`);
  } else if (storeIds.includes(selectedStore)) {
    alert(`Store ${selectedStore} is already in favorites.`);
  } else {
    alert("가게를 선택하세요.");
  }
}

// 즐겨찾기 목록 업데이트
function updateFavoriteList() {
  const favoriteList = document.getElementById("favoriteList");
  favoriteList.innerHTML = "";

  storeIds.forEach((id) => {
    const li = document.createElement("li");
    li.textContent = id;

    const removeButton = document.createElement("span");
    removeButton.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>';
    removeButton.style.cursor = "pointer";
    removeButton.style.marginLeft = "10px";
    removeButton.onclick = () => {
      removeFavorite(id);
    };

    li.appendChild(removeButton);
    favoriteList.appendChild(li);
  });
}

// 즐겨찾기 제거
function removeFavorite(storeId) {
  const index = storeIds.indexOf(storeId);
  if (index > -1) {
    storeIds.splice(index, 1);
    localStorage.setItem("favoriteStores", JSON.stringify(storeIds));
    updateFavoriteList();
    alert(`Store ${storeId} has been removed from favorites.`);
  } else {
    alert(`Store ${storeId} is not in favorites.`);
  }
}
