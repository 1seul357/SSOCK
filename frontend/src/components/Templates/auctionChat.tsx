import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";

import React, { useCallback, useEffect, useRef, useState } from "react";
import GeneralButtonWithoutText from "../../components/Atoms/Buttons/generalButtonWithoutText";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import NumberFormat from "react-number-format";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import GeneralButton from "../Atoms/Buttons/generalButton";
import {
  Bubble,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
  SystemMessage,
} from "react-native-gifted-chat";
import {
  get,
  getDatabase,
  off,
  onValue,
  push,
  ref,
  set,
  update,
} from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import { biddingAuction } from "../../apis/auctionApi";
import { reportUser } from "../../apis/auth";
const badWords = [
  "10새끼",
  "10쎄끼",
  "10알",
  "10창",
  "10탱",
  "10탱아",
  "10팔",
  "10팔년",
  "10팔놈",
  "10팔연",
  "10할년",
  "10할연",
  "18넘",
  "18년",
  "18놈",
  "18눔",
  "18늠",
  "18세끼",
  "18쉑끼",
  "18쎄리",
  "18쒜리",
  "18쒝끼",
  "18씨끼",
  "2c8",
  "2c팔",
  "갈보",
  "강간",
  "개넘",
  "개년",
  "개놈",
  "개뇬",
  "개눔",
  "개늠",
  "개때꺄",
  "개때끼",
  "개또라이",
  "개똥",
  "개보지",
  "개부랄",
  "개부럴",
  "개불알",
  "개새",
  "개새꺄",
  "개새끼",
  "개새리",
  "개새야",
  "개색",
  "개색기",
  "개색꺄",
  "개색끼",
  "개색히",
  "개샥",
  "개세",
  "개세끼",
  "개세이",
  "개섹",
  "개섺",
  "개셃",
  "개셋키",
  "개셐",
  "개소리",
  "개쇄끼",
  "개쇅",
  "개쇅갸",
  "개쇅기",
  "개쇅꺄",
  "개쇅끼",
  "개쇅캬",
  "개쇅키",
  "개쇗",
  "개쇗기",
  "개쇠리",
  "개쉐",
  "개쉐끼",
  "개쉐리",
  "개쉐이",
  "개쉑",
  "개쉑갸",
  "개쉑기",
  "개쉑꺄",
  "개쉑끼",
  "개쉑이",
  "개쉑캬",
  "개쉑키",
  "개쉑히",
  "개쉢",
  "개쉨",
  "개쉬끼",
  "개싀끼",
  "개싘",
  "개시퀴",
  "개시키",
  "개십팔",
  "개싯끼",
  "개싯키",
  "개싴",
  "개쌍넘",
  "개쌍년",
  "개쌍놈",
  "개쌔",
  "개쌔꺄",
  "개쌔끼",
  "개쌕",
  "개쌕끼",
  "개썅넘",
  "개썅년",
  "개썅놈",
  "개썅늠",
  "개썅연",
  "개쎅",
  "개쐐리",
  "개쒜",
  "개쒜끼",
  "개쒜리",
  "개쒝",
  "개쒝갸",
  "개쒝기",
  "개쒝꺄",
  "개쒝끼",
  "개쒝키",
  "개쒯",
  "개쒸",
  "개쒹기",
  "개씌끼",
  "개씨끼",
  "개씨발",
  "개씨팕",
  "개씹",
  "개씹창",
  "개씹팔",
  "개자슥",
  "개자싁",
  "개자식",
  "개자지",
  "개젓",
  "개젖",
  "개졋",
  "개졎",
  "개조또",
  "개조옷",
  "개족",
  "개좆",
  "개지랄",
  "개후레",
  "개후장",
  "거시기",
  "겁탈",
  "게넘",
  "게년",
  "게놈",
  "게뇬",
  "게뇽",
  "게눔",
  "게새끼",
  "게새리",
  "게색",
  "게색기",
  "게색끼",
  "게세",
  "게세꺄",
  "게세끼",
  "게섹",
  "게쉐",
  "게쉐이",
  "게시끼",
  "게시퀴",
  "고환",
  "공짜버그",
  "공짜캐쉬",
  "그룹섹스",
  "그지새끼",
  "그지좃밥",
  "그지좃빱",
  "그지좆밥",
  "근친",
  "근친상간",
  "기엉아",
  "기형아",
  "꼴려",
  "꼴리는",
  "꼴리다",
  "난교",
  "넣게벌려",
  "넣고싸고",
  "네에미",
  "년놈",
  "니미랄",
  "니미럴",
  "니미롤",
  "니미를",
  "니보지",
  "니애미",
  "니애비",
  "니어미",
  "니에미",
  "니에비",
  "니좆",
  "대딸",
  "딸딸이",
  "떡치기",
  "떡칠녀",
  "룸섹스",
  "마스터베이션",
  "매춘",
  "매춘부",
  "몸안에사정",
  "몸캠",
  "몸켐",
  "몸파는",
  "뮈칀세끼",
  "뮈칀세리",
  "뮈칀섹끼",
  "뮈친",
  "뮈친세리",
  "뮈친섹끼",
  "뮈친섹이",
  "미췬",
  "미췬년",
  "미췬세끼",
  "미췬쉐리",
  "미친",
  "미친넘",
  "미친년",
  "미친놈",
  "미친뇬",
  "미친새끼",
  "미친세리",
  "미친섹이",
  "미친자식",
  "미튄",
  "미틘",
  "미틩",
  "미틴",
  "미틴뇬",
  "밑구녕",
  "밑구녕빨기",
  "박고싶다",
  "박고싶퍼",
  "박아줄게",
  "박아줄께",
  "박을께",
  "박을년",
  "뱅쉰",
  "뱅싄",
  "뱅신",
  "뱡신",
  "버즤",
  "버지",
  "버지물",
  "버짓물",
  "번섹",
  "번쌕",
  "번쎅",
  "벙어리",
  "벼엉신",
  "변섹",
  "변태",
  "변퇴",
  "병쉰",
  "병싀",
  "병싄",
  "병신",
  "병씬",
  "보오지",
  "보쥐",
  "보즤",
  "보지",
  "보지걸",
  "보지구녕",
  "보지구멍",
  "보지나라",
  "보지당",
  "보지물",
  "보지보지",
  "보지털",
  "보짓년",
  "보짓물",
  "보짖물",
  "보G",
  "봉알",
  "뵤즤",
  "뵤지",
  "뵨태",
  "뵹딱",
  "뵹싄",
  "뵹신",
  "부랄",
  "부부섹스",
  "부카케",
  "불륜",
  "불알",
  "붕딱",
  "붕딲",
  "붕뛴",
  "붕싄",
  "붕시나",
  "붕신",
  "붕알",
  "붜지",
  "붱신",
  "뷍슨",
  "뷍싄",
  "뷍신",
  "뷩쉬",
  "뷩쉰",
  "뷩싄",
  "뷩신",
  "뷰웅신",
  "븅딱",
  "븅쉰",
  "븅싄",
  "븅시",
  "븅신",
  "븅아",
  "브랄",
  "블알",
  "븡딱",
  "븡쉰",
  "븡신",
  "븽딱",
  "븽쉬",
  "븽슨",
  "븽싄",
  "븽시",
  "븽신",
  "비잉신",
  "빙딱",
  "빙쉬",
  "빙쉰",
  "빙싀",
  "빙싄",
  "빙시",
  "빙신",
  "빠걸",
  "빠구리",
  "빠굴",
  "빠굴이",
  "빠꾸리",
  "빠도리",
  "빠돌이",
  "빠라",
  "빠라조",
  "빠라줘",
  "빠러",
  "빠수니",
  "빠순이",
  "빠큐",
  "빡돌",
  "빡촌",
  "빡큐",
  "빨어핥어박어",
  "빨자좃",
  "빨자좆",
  "빽보지",
  "빽자지",
  "뺑신",
  "뺑쒼",
  "뺑씬",
  "뺘큐",
  "뻐어큐",
  "뻐큐",
  "뻐킹",
  "뼝신",
  "뽀개",
  "뽀로노",
  "뽀르나",
  "뽀르너",
  "뽀르노",
  "뽀쥐",
  "뽀지",
  "뽀쮜",
  "뽕알",
  "뿅신",
  "뿅씬",
  "뿡알",
  "쁑신",
  "삐꾸",
  "삥쉰",
  "삥쒼",
  "삥씬",
  "사까시",
  "사까치",
  "사이버섹스",
  "사창가",
  "사카시",
  "사카치",
  "삽쥘",
  "삿가시",
  "삿까시",
  "삿깟시",
  "상년",
  "상노무",
  "상놈",
  "새꺄",
  "새뀌",
  "새끠",
  "새끼",
  "새뤼",
  "새에끼",
  "새키",
  "새X",
  "색갸",
  "색걸",
  "색골",
  "색광",
  "색기",
  "색꺄",
  "색끼",
  "색남",
  "색녀",
  "색마",
  "색스",
  "색쑤",
  "색쓰",
  "색캬",
  "색키",
  "색할",
  "색햐",
  "색히",
  "샊꺄",
  "샤불년",
  "샤앙년",
  "샵년",
  "샹넘",
  "샹년",
  "샹놈",
  "샹늠",
  "성관계",
  "성교",
  "성매매",
  "성섹스",
  "성욕구",
  "성인용품",
  "성체위",
  "성체험",
  "성추행",
  "성충동",
  "성폭력",
  "성폭행",
  "성행위",
  "세게빨아",
  "세꺄",
  "세뀌",
  "세끠",
  "세끼",
  "세액스",
  "세에끼",
  "세에쓰",
  "세엑",
  "세퀴",
  "세키",
  "섹남",
  "섹녀",
  "섹마",
  "섹보지",
  "섹수",
  "섹쉬",
  "섹슈",
  "섹스",
  "섹시",
  "섹파트너",
  "섹하자",
  "섹하장",
  "섹할",
  "섹해",
  "섹히",
  "섹s",
  "수간",
  "수음",
  "쉑수",
  "쉑스",
  "쉑쑤",
  "쉑쓰",
  "쉑캬",
  "스와핑",
  "스트립쇼",
  "스트립쑈",
  "스펄",
  "십8",
  "십넘",
  "십녀",
  "십놈",
  "십때꺄",
  "십때끼",
  "십떼끼",
  "십밸",
  "십새",
  "십새꺄",
  "십새끼",
  "십새캬",
  "십새키",
  "십색",
  "십색꺄",
  "십색끼",
  "십색히",
  "십세",
  "십세끼",
  "십쇄리",
  "십쉐",
  "십쉐리",
  "십쉐이",
  "십쉑",
  "십쉑히",
  "십시끼",
  "십쌔",
  "십쌔꺄",
  "십쎄끼",
  "십씨키",
  "십알",
  "십질",
  "십창",
  "십탱",
  "십탱구리",
  "십팔",
  "십팔년",
  "십팔련",
  "십팔연",
  "십할",
  "십할련",
  "싯끼",
  "싯빨",
  "싯팔",
  "싲팔",
  "싴팔",
  "싵팔",
  "싶알",
  "싶팔",
  "싸발년",
  "싸앙넘",
  "싸앙녀",
  "싸앙년",
  "싸줄께",
  "싹년",
  "쌉년",
  "쌍넌",
  "쌍넘",
  "쌍년",
  "쌍념",
  "쌍노무",
  "쌍놈",
  "쌍놈아",
  "쌍뇨나",
  "쌍뇬",
  "쌍뇸",
  "쌍뇽",
  "쌍뉸",
  "쌍연",
  "쌔꺄",
  "쌔끼",
  "쌔리",
  "쌔캬",
  "쌔키",
  "쌕",
  "쌕갸",
  "쌕걸",
  "쌕꺄",
  "쌕수",
  "쌕스",
  "쌕쑤",
  "쌕쓰",
  "쌩보지",
  "쌩포르노",
  "쌰앙넘",
  "쌰앙녀",
  "쌰앙년",
  "쌰앙눔",
  "쌰앙뉸",
  "썁색",
  "썅",
  "썅넌",
  "썅넘",
  "썅녀",
  "썅년",
  "썅놈",
  "썅뇬",
  "썅연",
  "썩을년",
  "쎅스",
  "쓰글넘",
  "쓰글년",
  "쓰글놈",
  "쓰글늠",
  "쓰발",
  "쓰발넘",
  "쓰벌",
  "쓰불",
  "쓰뷀",
  "쓰블",
  "씨댕",
  "씨댕년",
  "씨뎅",
  "씨바",
  "씨바라",
  "씨박",
  "씨발",
  "씨발넘",
  "씨발년",
  "씨발놈",
  "씨발놈아",
  "씨방새",
  "씨방세",
  "씨뱔",
  "씨벌",
  "씨벌년",
  "씨벧",
  "씨벨년",
  "씨벵",
  "씨봉",
  "씨봉알",
  "씨부랄",
  "씨부럴",
  "씨불",
  "씨불년",
  "씨불얼",
  "씨붕",
  "씨뷀",
  "씨브",
  "씨브랄",
  "씨브럴",
  "씨블",
  "씨블년",
  "씨앙년",
  "씨양년",
  "씨이바",
  "씨이발",
  "씨이방",
  "씨이밸",
  "씨이벌",
  "씨이빨",
  "씨이팔",
  "씨입년",
  "씨입뇬",
  "씨파",
  "씨팍",
  "씨팏",
  "씨팔",
  "씨팔년",
  "씨펄",
  "씹",
  "씹8",
  "씹넘",
  "씹년",
  "씹놈",
  "씹뇬",
  "씹딱꿍",
  "씹때꺄",
  "씹때끼",
  "씹떼",
  "씹떼끼",
  "씹물",
  "씹밸",
  "씹벌",
  "씹보지",
  "씹보지년",
  "씹블",
  "씹빡",
  "씹빨",
  "씹뻘",
  "씹새",
  "씹새꺄",
  "씹새끼",
  "씹새캬",
  "씹새키",
  "씹색꺄",
  "씹색끼",
  "씹색히",
  "씹샛길",
  "씹생알",
  "씹세",
  "씹세끼",
  "씹세이",
  "씹쉐",
  "씹쉐리",
  "씹쉐이",
  "씹쉑",
  "씹쉑히",
  "씹쌔",
  "씹쌔기",
  "씹쌔꺄",
  "씹쌔끼",
  "씹쌔키",
  "씹쎄",
  "씹쎄끼",
  "씹쒜",
  "씹씨키",
  "씹알",
  "씹연",
  "씹질",
  "씹창",
  "씹탱",
  "씹탱구리",
  "씹팔",
  "씹팔년",
  "씹팔련",
  "씹팔연",
  "씹펄",
  "씹풀",
  "씹할",
  "씹할련",
  "씹할연",
  "씻끼",
  "씻발",
  "씻벌",
  "씻뻘",
  "씻퐁",
  "씾팔",
  "앂년",
  "앂팔",
  "아이템매니아",
  "아이템메니아",
  "아이템베이",
  "안에사정",
  "알몸",
  "알몸공개",
  "알몸사진",
  "알몸쇼",
  "애액",
  "앰병",
  "앰창",
  "야녀",
  "야동",
  "야설",
  "엄창",
  "에믜",
  "에미",
  "여자보지",
  "염병",
  "염병할",
  "엿먹",
  "엿먹어",
  "옘병",
  "오나니",
  "오랄",
  "오럴",
  "오럴섹스",
  "오르가즘",
  "옹녀",
  "왕보지",
  "왕자지",
  "우라질",
  "원조교재",
  "원조교제",
  "원조알바",
  "월경",
  "유두",
  "유방",
  "육봉",
  "육시랄",
  "육시럴",
  "윤간",
  "윤락",
  "음경",
  "음담패설",
  "음란",
  "음순",
  "음액",
  "음욕",
  "입사후장",
  "입안사정",
  "자위",
  "자위기구",
  "자위남",
  "자위녀",
  "자지",
  "잡년",
  "잡놈",
  "잡뇬",
  "젓가튼",
  "젓같은",
  "젓까",
  "젓까는",
  "젓나",
  "젓나게",
  "젓마난",
  "젓만한",
  "젓밥",
  "젓빠지게",
  "정박아",
  "정자",
  "젖",
  "젖가튼",
  "젖같은",
  "젖까",
  "젖까는",
  "젖꼭지",
  "젖나게",
  "젖도",
  "젖마난",
  "젖만한",
  "젖물",
  "젖밥",
  "젖빠지게",
  "젖탱이",
  "젖통",
  "조가틍",
  "조까",
  "조까는",
  "조까라",
  "조까튼",
  "조낸",
  "조또",
  "조루",
  "조빠라",
  "조빠지게",
  "조빱",
  "조옷나",
  "조질래",
  "조카툰",
  "조털",
  "족가튼",
  "좀물",
  "좃",
  "좃가튼",
  "좃같은",
  "좃까",
  "좃까는",
  "좃까라",
  "좃나",
  "좃나게",
  "좃도",
  "좃물",
  "좃밥",
  "좃빠지게",
  "좄까",
  "좆",
  "좆",
  "좆구녕",
  "좆까",
  "좆까는",
  "좆나",
  "좆대가리",
  "좆도",
  "좆물",
  "좆밥",
  "좇",
  "좇까",
  "죳",
  "죶",
  "죶가튼",
  "죶빠지게",
  "지랄",
  "짬지",
  "찌찌",
  "창남",
  "창녀",
  "창녀촌",
  "창년",
  "창뇨",
  "창뇬",
  "챵녀",
  "챵년",
  "챵뇬",
  "처녀막",
  "최음제",
  "카섹",
  "카섹스",
  "캐세끼",
  "캐쉬버그",
  "캐시버그",
  "큰보지",
  "큰자지",
  "페니스",
  "포르노",
  "포르노사진",
  "포르노섹스",
  "폰색",
  "폰세엑",
  "폰섹",
  "폰섹스",
  "폰쉑",
  "폰쌕",
  "폰쎅",
  "프리섹스",
  "플레이보지",
  "한번꽂자",
  "한번주께",
  "한번줄래",
  "핥아주께",
  "핧아줄께",
  "함대주까",
  "함대줄래",
  "함빨자",
  "항문",
  "허벌",
  "허벌창",
  "호로년",
  "호로새끼",
  "호로새리",
  "호로색",
  "호로색끼",
  "호로자슥",
  "호로자식",
  "호모섹기",
  "호모쎄끼",
  "호빠",
  "호스트바",
  "호스트빠",
  "혼음",
  "화냥",
  "화냥년",
  "화류",
  "화양년",
  "후레자식",
  "후장",
  "후장입사",
  "ac발",
  "x대가리",
];
type Props = {};
const { height: ScreenHeight, width: ScreenWidth } = Dimensions.get("window");

const AuctionChat = ({ user, userId, userAvatar, item }) => {
  const [currentCost, setCurrentCost] = useState();
  const [bidRightNow, setBidRightNow] = useState<string>("15000");
  const [bidAssignValue, setBidAssignValue] = useState<string>("15000");
  const [chatText, setChatText] = useState<string>("");
  const [offset, setOffset] = useState(0);
  const [username, setUsername] = useState(null);
  const [users, setUsers] = useState([]);
  const [userToAdd, setUserToAdd] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [myData, setMyData] = useState<any>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [userData, setUserData] = useState([]);
  const [itemId, setItemId] = useState(item.itemSeq);
  const [blackList, setBlackList] = useState(null);

  useEffect(() => {
    Platform.OS === "ios" && setOffset(60);
    setMessages([]);
  }, []);

  useEffect(() => {
    setCurrentCost(item.bidding ? item.bidding.biddingPrice : item.startPrice);
  }, []);

  useEffect(() => {
    setBidRightNow(String((Number(currentCost) * 1.03).toFixed()));
  }, [currentCost]);

  const [iskeyboardUp, setIsKeyboardUp] = useState(false);
  const navigation = useNavigation();
  const findUser = async () => {
    const database = getDatabase();
    const mySnapshot = await get(ref(database, `users/${userId}`));
    return mySnapshot.val();
  };
  const onLogin = async () => {
    try {
      const database = getDatabase();
      const user = await findUser();
      if (user) {
        setMyData(user);
      } else {
        const newUserObj = {
          userId: userId,
          avatar: userAvatar,
        };
        set(ref(database, `users/${userId}`), newUserObj);
        setMyData(newUserObj);
      }

      // set chatroom list change listener
      const myUserRef = ref(database, `users/${userId}`);

      const auctionChatroom = await get(
        ref(database, `auctionChatrooms/${itemId}`),
      );

      if (!auctionChatroom) {
        set(ref(database, `auctionChatrooms/${itemId}`), {
          itemId: itemId,
          messages: [],
        });
      }

      const auctionChatRef = ref(database, `auctionChatrooms/${itemId}`);
      onValue(auctionChatRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setMessages(renderMessages(data.messages));
        }
      });

      onValue(myUserRef, (snapshot) => {
        const data = snapshot.val();
        setUsers(data?.friends);
        setMyData((prevData) => ({
          ...prevData,
          friends: data?.friends,
        }));
      });
    } catch (error) {
      navigation.navigate("main");
    }
  };
  useEffect(() => {
    const database = getDatabase();
    get(ref(database, "users")).then((res) => {
      setUserData(res);
    });
  }, [userId]);

  useEffect(() => {
    if (userId) {
      onLogin();
    }
  }, [userId]);

  useEffect(() => {
    user !== null && setBlackList(user.blackList);
  }, [user]);

  useEffect(() => {
    console.log(blackList);
  }, [blackList]);

  useEffect(() => {
    Keyboard.addListener("keyboardWillShow", () => {
      setIsKeyboardUp(true);
    });
    Keyboard.addListener("keyboardWillHide", () => {
      setIsKeyboardUp(false);
    });

    return () => setIsKeyboardUp(false);
  }, []);

  const handlebidRightNow = () => {
    Alert.alert(
      "즉시 입찰",
      `입찰가 : ${bidRightNow}원에 \n 즉시 입찰하시겠습니까?`,
      [
        {
          text: "예",
          onPress: async () => {
            const formData = new FormData();
            const bid = Number(bidRightNow);
            formData.append("biddingPrice", bid);

            const hammer: any = false;
            formData.append("isHammered", hammer);
            try {
              const result = await biddingAuction(item.itemSeq, formData);

              if (result.statusCode === 201) {
                onSend([
                  {
                    _id: `${new Date()}${userId}${bidRightNow}`,
                    createdAt: new Date(),
                    user: {
                      _id: userId,
                    },
                    type: "bid",
                    price: `${bidRightNow}`,
                    text: `${bidRightNow}원에 입찰했습니다.`,
                    system: true,
                  },
                ]);
              }
            } catch (error) {
              Alert.alert("경매", "입찰에 실패했습니다.");
            }
          },
        },
        {
          text: "아니오",
          onPress: () => {},
        },
      ],
    );
  };

  const fetchMessages = useCallback(async () => {
    const database = getDatabase();

    const snapshot = await get(ref(database, `auctionChatrooms/${itemId}`));

    return snapshot.val();
  }, [itemId]);

  const onSend = useCallback(
    async (msg = []) => {
      //send the msg[0] to the other user
      if (!msg[0].type) {
        msg[0].type = "text";
      }

      for (let n = 0; n < badWords.length; n++) {
        if (msg[0].text.includes(badWords[n])) {
          const starWord = "*".repeat(badWords[n].length);
          msg[0].text = msg[0].text.replace(badWords[n], starWord);
        }
      }
      const database = getDatabase();

      //fetch fresh messages from server
      const currentChatroom = await fetchMessages();
      const lastMessages = currentChatroom?.messages || [];

      update(ref(database, `auctionChatrooms/${itemId}`), {
        messages: [
          ...lastMessages,
          {
            text: msg[0].text,
            sender: msg[0].user._id,
            createdAt: new Date(),
            type: msg[0].type,
            price: msg[0].price ? msg[0].price : "",
          },
        ],
      });

      setMessages((prevMessages) => GiftedChat.append(prevMessages, msg));
    },
    [fetchMessages, myData?.userId, itemId],
  );

  const renderMessages = useCallback(
    (msgs) => {
      //structure for chat library:
      // msg = {
      //   _id: '',
      //   user: {
      //     avatar:'',
      //     name: '',
      //     _id: ''
      //   }
      // }
      if (msgs[msgs.length - 1].type === "bid") {
        if (currentCost && msgs[msgs.length - 1].price > currentCost) {
          setCurrentCost(msgs[msgs.length - 1].price);
        }
      }

      return msgs
        ? msgs.reverse().map((msg, index) =>
            user.blackList.includes(msg.sender)
              ? {
                  ...msg,
                  _id: index,
                  text: msg.type !== "bid" ? "" : msg.text,
                  user: {
                    _id:
                      msg.sender === myData?.userId
                        ? myData?.userId
                        : msg.sender,
                    avatar:
                      msg.sender === myData?.userId
                        ? myData?.avatar
                        : msg.sender,
                    name:
                      msg.sender === myData?.userId
                        ? myData?.userId
                        : msg.sender,
                  },
                  type: msg.type,
                }
              : {
                  ...msg,
                  _id: index,
                  user: {
                    _id:
                      msg.sender === myData?.userId
                        ? myData?.userId
                        : msg.sender,
                    avatar:
                      msg.sender === myData?.userId
                        ? myData?.avatar
                        : msg.sender,
                    name:
                      msg.sender === myData?.userId
                        ? myData?.userId
                        : msg.sender,
                  },
                  type: msg.type,
                },
          )
        : [];
    },
    [myData?.avatar, myData?.userId, itemId, messages],
  );
  useEffect(() => {
    Platform.OS === "ios" && setOffset(40);

    //load old messages
    const loadData = async () => {
      const myChatroom = await fetchMessages();

      myChatroom && setMessages(renderMessages(myChatroom.messages));
      !myChatroom &&
        set(ref(database, `auctionChatrooms/${itemId}`), {
          itemId,
          messages: [
            {
              _id: 0,
              text: "채팅방이 생성되었습니다.",
              createdAt: new Date(),
              system: true,
            },
            {
              _id: 1,
              text: "욕설과 비난은 자제해주시기 바라며, 신고를 원하시면 말풍선을 길게 터치하세요.",
              createdAt: new Date(),
              system: true,
            },
            {
              _id: 2,
              text: "현재 욕설 필터링이 적용중입니다.",
              createdAt: new Date(),
              system: true,
            },
          ],
        });
    };

    loadData();

    // set chatroom change listener
    const database = getDatabase();
    const chatroomRef = ref(database, `auctionChatrooms/${itemId}`);
    onValue(chatroomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMessages(renderMessages(data.messages));
      }
    });

    return () => {
      //remove chatroom listener
      off(chatroomRef);
    };
  }, [fetchMessages, itemId]);
  const handleOnchangebidRightNow = (e: any) => {
    setBidRightNow(e.nativeEvent.text);
  };

  const handleOnchangebidAssignValue = (e: any) => {
    setBidAssignValue(e.nativeEvent.text);
  };

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        renderAvatar={() => null}
        renderBubble={(props) => <Bubble {...props} />}
        onLongPress={function (context, message) {
          if (message.user._id !== userId) {
            Alert.alert(
              `신고하기`,
              `익명 유저의 "${message.text}" 내용을 신고하시겠습니까?\n신고 후에는 대상자의 채팅을 볼 수 없습니다.`,
              [
                {
                  text: "예",
                  onPress: () => {
                    if (message.type === "text") {
                      reportUser(message.user._id)
                        .then((res) => {
                          Alert.alert(
                            "신고",
                            "접수가 완료되었습니다.\n더 이상 신고 대상자의 채팅을\n확인할 수 없습니다.",
                          );
                        })
                        .catch(() => {
                          Alert.alert(
                            "신고",
                            "신고 접수에 실패했습니다.\n신고 내용을 확인해주세요.",
                          );
                        });
                    } else {
                      Alert.alert("신고", "신고할 수 없는 채팅입니다.");
                    }
                  },
                },
                {
                  text: "아니오",
                  style: "cancel",
                },
              ],
            );
          } else {
          }
        }}
        // showAvatarForEveryMessage={false}
        // showUserAvatar={true}

        messages={messages}
        onSend={onSend}
        user={{
          _id: userId,
        }}
        bottomOffset={offset}
        messagesContainerStyle={{
          backgroundColor: "#719dd7",
        }}
        renderInputToolbar={(props) => (
          <InputToolbar {...props} containerStyle={styles.textArea} />
        )}
        renderSystemMessage={(props) => {
          return <SystemMessage {...props} textStyle={{ color: "#444" }} />;
        }}
        renderSend={(props) => {
          return (
            <Send
              {...props}
              containerStyle={{
                borderWidth: 0,
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="send-outline" size={24} color="black" />
            </Send>
          );
        }}
        scrollToBottom={true}
      />
      {iskeyboardUp === false && (
        <View style={{ alignItems: "center" }}>
          <Text style={{ marginTop: 3 }}>현재 가격 : {currentCost}원</Text>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity
              onPress={handlebidRightNow}
              style={styles.bidButton}
            >
              <Text style={styles.bidText}>{bidRightNow}원</Text>
              <Text style={styles.bidText}>즉시 입찰</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* {Platform.OS === "android" && <KeyboardAvoidingView behavior="padding" />} */}
    </View>
  );
};

export default AuctionChat;

const styles = StyleSheet.create({
  box: {
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  textArea: {
    borderWidth: 1,
    borderTopColor: "black",
    borderTopWidth: 1,
    borderColor: "black",
    borderRadius: 9999,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    height: 40,
    paddingLeft: 8,
    paddingRight: 8,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  bidButton: {
    height: ScreenHeight / 10,
    width: ScreenHeight / 10,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#719DD7",
  },
  bidText: {
    color: "white",
  },
});
