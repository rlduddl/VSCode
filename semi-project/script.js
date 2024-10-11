let storeIds = JSON.parse(localStorage.getItem("favoriteStores")) || []; // 로컬 스토리지에서 데이터 로드

const API_KEY = "78a4b456e0a19ac893591fb5dc67d523"; // 여기에 자신의 카카오 API 키를 입력하세요.
// JS Key 9989d99695095d70a95ed8d70580c383
// REST Key 78a4b456e0a19ac893591fb5dc67d523

// 페이지 로드 시 즐겨찾기 목록 업데이트
window.onload = function () {
  // script.onload = () => initMap(); // API가 로드된 후 initMap 호출
  checkLoginStatus(); // 로그인 상태 확인 함수 호출
  initMap();
  updateFavoriteList();
};

function checkLoginStatus() {
  fetch("/check_login") // 서버에 로그인 상태 요청
    .then((response) => response.json())
    .then((data) => {
      isLoggedIn = data.isLoggedIn; // 로그인 상태 설정
      document.getElementById("logoutButton").style.display = isLoggedIn
        ? "block"
        : "none"; // 상태에 따라 로그아웃 버튼 표시
    });
}

// 지도 초기화 함수
function initMap() {
  const mapContainer = document.getElementById("map");
  const mapOptions = {
    center: new kakao.maps.LatLng(33.450701, 126.570667), // 기본 중심 좌표
    level: 3, // 확대 레벨
  };

  const map = new kakao.maps.Map(mapContainer, mapOptions);
}

// 가게 검색
function searchStores() {
  const query = document.getElementById("storeQuery").value.trim();
  const searchResults = document.getElementById("searchResults");
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
        Authorization: `KakaoAK ${API_KEY}`,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.documents.length === 0) {
        alert("검색 결과가 없습니다.");
        return;
      }

      data.documents.forEach((store) => {
        const li = document.createElement("li");
        li.textContent = `${store.place_name} - ${store.address_name}`;

        // 가게를 클릭했을 때 주소로 위치 표시
        li.onclick = () => {
          showLocation(store.address_name);
          selectedStore = store.place_name; // 선택한 가게 이름 저장
          document.getElementById("storeId").value = selectedStore; // 선택한 가게 이름을 인풋란에 표시

          // 즐겨찾기 추가 버튼으로 스크롤 이동
          document
            .getElementById("addFavoriteBtn")
            .scrollIntoView({ behavior: "smooth" });
        };

        searchResults.appendChild(li);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("가게 검색에 실패했습니다.");
    });
}

// 주소로 위치 표시
function showLocation(address) {
  var mapContainer = document.getElementById("map"), // 지도를 표시할 div
    mapOption = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
    };

  // 지도를 생성합니다
  var map = new kakao.maps.Map(mapContainer, mapOption);

  // 주소-좌표 변환 객체를 생성합니다
  var geocoder = new kakao.maps.services.Geocoder();

  // 주소로 좌표를 검색합니다
  geocoder.addressSearch(address, function (result, status) {
    // 정상적으로 검색이 완료됐으면
    if (status === kakao.maps.services.Status.OK) {
      var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

      // 결과값으로 받은 위치를 마커로 표시합니다
      var marker = new kakao.maps.Marker({
        map: map,
        position: coords,
      });

      // 인포윈도우로 장소에 대한 설명을 표시합니다
      var infowindow = new kakao.maps.InfoWindow({
        content:
          '<div style="width:150px;text-align:center;padding:6px 0;">' +
          address +
          "</div>",
      });
      infowindow.open(map, marker);

      // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
      map.setCenter(coords);
    }
  });
}

// 즐겨찾기 추가
function addFavorite() {
  if (selectedStore && !storeIds.includes(selectedStore)) {
    storeIds.push(selectedStore);
    localStorage.setItem("favoriteStores", JSON.stringify(storeIds)); // 로컬 스토리지에 저장
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
  favoriteList.innerHTML = ""; // 기존 목록 초기화

  storeIds.forEach((id) => {
    const li = document.createElement("li");
    li.textContent = id;

    // Font Awesome 아이콘 추가
    const removeButton = document.createElement("span");
    removeButton.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>';
    removeButton.style.cursor = "pointer";
    removeButton.style.marginLeft = "10px";
    removeButton.onclick = () => {
      removeFavorite(id); // 특정 가게 제거 함수 호출
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
    localStorage.setItem("favoriteStores", JSON.stringify(storeIds)); // 로컬 스토리지에 저장
    updateFavoriteList();
    alert(`Store ${storeId} has been removed from favorites.`);
  } else {
    alert(`Store ${storeId} is not in favorites.`);
  }
}
