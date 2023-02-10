let news = [];
let page = 1;
let total_pages=0;
let menus = document.querySelectorAll(".menus button")
let searchbutton= document.getElementById("search-button");
let url;

menus.forEach(menu=> menu.addEventListener("click",(event)=>getNewsByTopic(event)));

//각함수에서 필요한 url만든다.
//api호출 함수를 부른다.

const getNews = async() =>{
  try{
    let header = new Headers({'x-api-key':'LHvjKv7U6tyr6naSW28Lnl4mn9fjZXp_geHD1KAYXx4'})
    
    url.searchParams.set('page',page); //$page=전역변수
    console.log("url은",url)
    let response = await fetch(url, {headers:header});
    let data = await response.json() // ajax, http,fetch
    if(response.status == 200){
      if(data.total_hits==0){
        throw new Error("검색된 결과값이 없습니다.")
      }
      console.log("받은데이터가뭐지?",data)
      news = data.articles
      total_pages=data.total_pages;
      page = data.page;
      console.log(news);
    render();
    pagenation();

    }else{
      throw new error(data.message)
      errorRender(error.message)
    }
   
  
  
  }
  catch(error){
    console.log("잡힌에러는",error.message)
    errorRender(error.message)
  }

}

const getLastestNews = async() =>{
     url=new URL('https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport');

      getNews()
    
};

const getNewsByKeyword = async () =>{
  //1.검색 키워드 읽어오기
  //2.url에 검색 키워드 부치기
  //3.헤더준비
  //4.url부르기
  //5.데이터 가져오기
  //6.데이터 불러오기

  let keyword = document.getElementById("search-input").value;
  url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`);
 
  getNews()
}

const getNewsByTopic = async (event) =>{
    console.log("클릭됨",event.target.textContent);
    let topic = event.target.textContent.toLowerCase();
    url= new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`)

   getNews()
}


const render = () =>{
    let newsHTML = ``;
    newsHTML = news.map((item)=>{
        return `<div class="row news">
        <div class="col-lg-4">
          <img class="new-img-size" src="${item.media}"/>
        </div>
        <div class="col-lg-8">
          <h2>${item.title}</h2>
          <p>
              ${item.summary}
          </p>

          <div>
              ${item.rights} * ${item.published_date}
          </div>
        </div>
      </div>`;
    }).join('');



    document.getElementById("news-board").innerHTML=newsHTML;
}

const errorRender = (message) =>{
  let errorHTML = `<div class="alert alert-danger text-center" role="alert">
  ${message}
</div>`;
  document.getElementById("news-board").innerHTML=errorHTML;
}

const pagenation = () =>{
  let pagenationHTML=``;

  //total_page
  //page
  //page group
  let PageGroup= Math.ceil(page/5)
  //last
  let last
  if(page==total_pages){
    last = total_pages;
  }else{
    last = PageGroup*5;
  }
  console.log("last값",last)
  
  //first
  let first = (PageGroup*5)-4;
  //first-last 페이지 프린트

  //total page 경우 3일떄 3개의페이지만 프린트하는법 last,frist
  //<< >> 이버튼들 만들어주기 맨처음,맨끝으로 가는 버튼 만들기
  //내가 그룹이1일떄 << <버튼 없애기
  //내가 마지막 그룹일떄 >> >버튼 없애기
  
  if(page==1){
    pagenationHTML=``
  }else{
    pagenationHTML+=`<li class="page-item">
    <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${1})">
      <span aria-hidden="true">&laquo;</span>
    </a>
  </li>` ;
  
  }
    


  pagenationHTML+= ` <li class="page-item">
  <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page-1})">
    <span aria-hidden="true">&lt;</span>
  </a>
</li>`;
  for(let i =first;i<=last;i++){
    pagenationHTML+= `<li class="page-item ${page==i?"active":""}"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`
  }
 


  pagenationHTML+=` <li class="page-item">
  <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${page+1})">
    <span aria-hidden="true">&gt;</span>
  </a>
</li>`

if(page==total_pages){
  pagenationHTML+=``
}else{
  pagenationHTML+=`<li class="page-item">
  <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${total_pages})">
    <span aria-hidden="true">&raquo;</span>
  </a>
  </li>` ;
}



  document.querySelector(".pagination").innerHTML=pagenationHTML;

}


const moveToPage= (pageNum) =>{
  //1이동하고싶은 페이지를 알아야겠다.
  page = pageNum
  console.log("페이지",page)
  //2이동하고싶은 페이지를 가지고 api를 다시 호추해주자
  getNews()
}
searchbutton.addEventListener("click",getNewsByKeyword);
getLastestNews();
