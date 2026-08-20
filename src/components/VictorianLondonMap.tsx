import React, { useEffect, useRef, useState } from 'react';
import { Search, Compass } from 'lucide-react';

export interface LocationItem {
  id: string;
  name: string;
  nameEn: string;
  category: 'babbage' | 'lovelace' | 'marx' | 'landmark';
  categoryLabel: string;
  lat: number;
  lng: number;
  period: string;
  victorianAddress: string;
  modernAddress: string;
  summary: string;
  quote?: string;
  quoteSource?: string;
  significance: string;
  connections: string[];
}

export const LOCATIONS: LocationItem[] = [
  {
    id: 'babbage-birthplace',
    name: '찰스 배비지 출생지',
    nameEn: 'Charles Babbage Birthplace',
    category: 'babbage',
    categoryLabel: '찰스 배비지',
    lat: 51.4883,
    lng: -0.0989,
    period: '1791년',
    victorianAddress: '44 Crosby Row, Walworth Road, Newington, Surrey',
    modernAddress: 'Junction of Larcom St & Walworth Rd, London SE17',
    summary: '부유한 은행가 벤저민 배비지의 장남으로 출생. 유년기부터 오토마타와 기계 장난감 분해에 비상한 집착을 보였습니다.',
    significance: '잉글리시 헤리티지 블루 플라크 지정 장소.',
    connections: ['도싯 가 1번지', '조셉 클레먼트 공방']
  },
  {
    id: 'dorset-street',
    name: '도싯 가 1번지 (자택·공방·살롱)',
    nameEn: '1 Dorset Street (Home, Workshop & Salon)',
    category: 'babbage',
    categoryLabel: '찰스 배비지',
    lat: 51.519713,
    lng: -0.15462,
    period: '1829–1871년 (42년간 거주 및 연구)',
    victorianAddress: '1 Dorset Street, Manchester Square, Marylebone',
    modernAddress: '1a Dorset Street, Marylebone, London W1U 4EE',
    summary: '배비지의 주 거주지이자 후원 화재 방지 2층 공방. 매주 토요일 밤 200~300명의 런던 지식인·문인·귀족이 모인 전설적인 살롱이 열렸습니다.',
    quote: '배비지의 살롱에 초대받는 것은 우주의 기관실(engine room of the universe)에 입장하는 것과 같았다.',
    quoteSource: '시드니 스미스(Sydney Smith), 당대 비평가 회고',
    significance: '1832년 차분기관 시제품과 은빛 숙녀 오토마타가 시연되었으며, 1833년 에이다 러브레이스와 처음 만난 역사적 장소.',
    connections: ['에이다 첫 만남 장소', '조셉 클레먼트 공방', '대영박물관 열람실']
  },
  {
    id: 'clement-workshop',
    name: '조셉 클레먼트 정밀 공방',
    nameEn: "Joseph Clement's Engineering Works",
    category: 'babbage',
    categoryLabel: '찰스 배비지',
    lat: 51.495,
    lng: -0.103,
    period: '1823–1833년',
    victorianAddress: '21 Prospect Place, St George\'s Fields, Lambeth/Southwark',
    modernAddress: 'St George\'s Road / Elephant & Castle, London SE1',
    summary: '영국 최고의 정밀 공학자 조셉 클레먼트의 공방. 차분기관 1호의 부품 2,000여 개와 1832년 시험 모델이 초정밀 가공된 역사적 현장입니다.',
    significance: '1833년 숙련 노동자 임금 분쟁과 작업장 이전 갈등으로 차분기관 1호 제작이 중단된 비운의 장소.',
    connections: ['도싯 가 1번지', '1862년 만국박람회']
  },
  {
    id: 'kensal-green',
    name: '켄살 그린 묘지 (배비지 안장지)',
    nameEn: 'Kensal Green Cemetery (Grave 1791)',
    category: 'babbage',
    categoryLabel: '찰스 배비지',
    lat: 51.52747,
    lng: -0.224086,
    period: '1871년 10월 24일 안장',
    victorianAddress: 'General Cemetery of All Souls, Kensal Green, Harrow Road',
    modernAddress: 'Harrow Road, London W10 4RA (Square 84, Grave 1791)',
    summary: '1871년 10월 18일 도싯 가에서 영면한 배비지의 최종 안장지. 루비슬로 화강암 석판으로 제작된 묘비가 보존되어 있습니다.',
    significance: '영국 2급 등록 문화재(Grade II Listed Monument).',
    connections: ['도싯 가 1번지']
  },
  {
    id: 'ada-first-meeting',
    name: '에이다 바이런과의 첫 만남 (도싯 가)',
    nameEn: 'Ada Lovelace First Meeting at Dorset St',
    category: 'lovelace',
    categoryLabel: '에이다 러브레이스',
    lat: 51.5198,
    lng: -0.1543,
    period: '1833년 6월 5일',
    victorianAddress: '1 Dorset Street, Manchester Square, Marylebone',
    modernAddress: '1a Dorset Street, Marylebone, London W1U 4EE',
    summary: '17세의 에이다 바이런이 어머니 바이런 부인, 메리 서머빌과 함께 배비지의 살롱을 방문하여 차분기관 시제품의 수학적 작동을 직관적으로 꿰뚫어 본 순간입니다.',
    quote: '다른 사람들은 신기한 마술 무기나 춤추는 인형을 보듯 기계를 바라보았지만, 미스 바이런은 어린 나이에도 기계의 작동 원리를 이해했고 그 위대한 아름다움을 보았다.',
    quoteSource: '소피아 프렌드(Sophia Frend / De Morgan), 1895년 회고록',
    significance: '컴퓨터 역사상 가장 위대한 10년간의 지적 협업이 시작된 지점.',
    connections: ['도싯 가 1번지', '세인트 제임스 스퀘어 12번지', '오컴 파크']
  },
  {
    id: 'st-james-square',
    name: '세인트 제임스 스퀘어 12번지',
    nameEn: '12 St James\'s Square (Lovelace London House)',
    category: 'lovelace',
    categoryLabel: '에이다 러브레이스',
    lat: 51.5075,
    lng: -0.1352,
    period: '1840년대',
    victorianAddress: '12 St James\'s Square, Westminster, London',
    modernAddress: '12 St James\'s Square, London SW1Y 4LB',
    summary: '러브레이스 백작 가문의 런던 공식 타운하우스. 1843년 여름, 메나브레아 논문 번역과 7개 주석(Notes A~G)의 원고 및 인쇄 교정본이 도싯 가 배비지에게 매일 특송으로 오간 거점입니다.',
    significance: '1843년 8월 14일 에이다가 배비지에게 보낸 16쪽 분량의 역사적 협업 제안서가 작성된 곳.',
    connections: ['도싯 가 1번지', '오컴 파크', '컴벌랜드 플레이스']
  },
  {
    id: 'fordhook-house',
    name: '포드훅 하우스 (에이다 유년기 거처)',
    nameEn: 'Fordhook House (Ada Childhood Home)',
    category: 'lovelace',
    categoryLabel: '에이다 러브레이스',
    lat: 51.5085,
    lng: -0.298,
    period: '1830년대 초',
    victorianAddress: 'Fordhook House, Ealing, Middlesex',
    modernAddress: 'Byron Road / Uxbridge Road area, Ealing, London W5',
    summary: '바이런 부인과 에이다의 전원 저택. 에이다는 이곳에서 유클리드 기하학, 천문학, 그리고 새의 해부 구조를 모방한 비행 기계 연구(Flyology)에 몰두했습니다.',
    significance: '에이다가 엄격한 수학 교육을 받으며 상상력과 과학을 융합하는 \'시적 과학(Poetical Science)\'의 기초를 다진 곳.',
    connections: ['에이다 첫 만남 장소']
  },
  {
    id: 'cumberland-place',
    name: '그레이트 컴벌랜드 플레이스 6번지 (임종지)',
    nameEn: '6 Great Cumberland Place (Final Residence)',
    category: 'lovelace',
    categoryLabel: '에이다 러브레이스',
    lat: 51.516,
    lng: -0.1595,
    period: '1851–1852년',
    victorianAddress: '6 Great Cumberland Place, Marylebone, London',
    modernAddress: '6 Great Cumberland Place, Marylebone, London W1H 7AL',
    summary: '에이다가 자궁암으로 투병하다 1852년 11월 27일 36세로 서거한 거처. 배비지는 임종 직전까지 병상을 지키며 과학과 철학을 나누었습니다.',
    significance: '에이다의 유언에 따라 생전에 한 번도 보지 못한 아버지 조지 고든 바이런 경 곁(노팅엄셔 허크널 토커드 교회)에 안장되었습니다.',
    connections: ['도싯 가 1번지', '세인트 제임스 스퀘어 12번지']
  },
  {
    id: 'british-museum',
    name: '대영박물관 열람실 (마르크스 연구 거점)',
    nameEn: 'British Museum Round Reading Room',
    category: 'marx',
    categoryLabel: '칼 마르크스 & 사상사',
    lat: 51.5194,
    lng: -0.1269,
    period: '1850–1883년 (마르크스 주 열람처)',
    victorianAddress: 'Great Russell Street, Bloomsbury, London',
    modernAddress: 'The British Museum, Great Russell St, London WC1B 3DG',
    summary: '마르크스가 1850년 6월 12일 앤서니 파니치 경으로부터 열람증(No. 10,488)을 발급받아 Desk O-7에서 매일 10시간씩 『자본론』과 『그룬트리스』를 집필한 성지. 배비지의 저작을 정밀 독해하고 발췌했습니다.',
    quote: '도구에서 기계로의 전환은 산업혁명의 출발점이며, 배비지는 노동력의 세분화와 도덕적 마모를 가장 예리하게 포착한 산업 이론가이다.',
    quoteSource: '칼 마르크스, 『자본론』 제1권 제13장 & 제14장',
    significance: '배비지의 자택(도싯 가)에서 불과 2.4km 거리로, 배비지의 기술 경제학이 마르크스의 자본 비판으로 재구성된 지적 심장부.',
    connections: ['도싯 가 1번지', '마르크스 소호 거처', '마르크스 메이틀랜드 거처']
  },
  {
    id: 'marx-dean-street',
    name: '칼 마르크스 소호 거처 (28 Dean St)',
    nameEn: 'Karl Marx Soho Residence (28 Dean St)',
    category: 'marx',
    categoryLabel: '칼 마르크스 & 사상사',
    lat: 51.5135,
    lng: -0.1322,
    period: '1850–1856년',
    victorianAddress: '28 Dean Street, Soho, London',
    modernAddress: '28 Dean Street, Soho, London W1D 3SR (현 Quo Vadis 레스토랑)',
    summary: '마르크스 가족이 극심한 빈곤과 망명 생활 속에서 거주한 2칸짜리 방. 이곳에서 배비지의 『기계 및 제조업의 경제학』을 발췌한 『런던 노트』를 작성했습니다.',
    significance: '블루 플라크 설치 장소. 런던 도심 슬럼가에서 탄생한 자본주의 기계론의 산실.',
    connections: ['대영박물관 열람실', '마르크스 메이틀랜드 거처']
  },
  {
    id: 'marx-maitland',
    name: '칼 마르크스 메이틀랜드 파크 거처',
    nameEn: 'Karl Marx Maitland Park Residence',
    category: 'marx',
    categoryLabel: '칼 마르크스 & 사상사',
    lat: 51.5472,
    lng: -0.1558,
    period: '1864–1883년',
    victorianAddress: '1 Modena Villas / 41 Maitland Park Road, Haverstock Hill',
    modernAddress: 'Maitland Park Road, Belsize Park, London NW3 2EX',
    summary: '마르크스가 『자본론』 제1권을 최종 탈고(1867년 출간)하고 1883년 숨을 거둔 북런던 거처입니다.',
    significance: '배비지의 기계 감가상각과 5년 갱신설을 엥겔스와 서신으로 검증하며 자본론을 완성한 장소.',
    connections: ['대영박물관 열람실', '마르크스 소호 거처']
  },
  {
    id: 'somerset-house',
    name: '소머싯 하우스 (왕립학회 구 본부)',
    nameEn: 'Somerset House (Royal Society 1780–1857)',
    category: 'landmark',
    categoryLabel: '학술 & 산업 랜드마크',
    lat: 51.511,
    lng: -0.1172,
    period: '1816–1857년',
    victorianAddress: 'Somerset House, Strand, London',
    modernAddress: 'Strand, London WC2R 1LA',
    summary: '1816년 배비지가 24세에 왕립학회 회원(FRS)으로 선출되고 수많은 수학 논문을 발표한 곳. 배비지는 이곳에서 영국 과학계의 귀족주의적 나태를 맹렬히 비판했습니다.',
    significance: '1830년 명저 『영국 과학의 쇠퇴에 관한 고찰』 출간의 배경이 된 제도적 무대.',
    connections: ['도싯 가 1번지', '벌링턴 하우스']
  },
  {
    id: 'burlington-house',
    name: '벌링턴 하우스 (왕립학회·천문학회 신 본부)',
    nameEn: 'Burlington House (Royal Society & RAS)',
    category: 'landmark',
    categoryLabel: '학술 & 산업 랜드마크',
    lat: 51.509,
    lng: -0.1398,
    period: '1857년 이후',
    victorianAddress: 'Burlington House, Piccadilly, Mayfair, London',
    modernAddress: 'Piccadilly, London W1J 0BD',
    summary: '왕립학회(1857년 이전)와 배비지가 공동 창립한 왕립천문학회(1874년 이전)의 통합 지적 거점입니다.',
    significance: '피카딜리 중심가에 위치한 빅토리아 시대 과학 혁신의 제도적 총본산.',
    connections: ['소머싯 하우스', '도싯 가 1번지']
  },
  {
    id: 'royal-institution',
    name: '왕립연구소 (RI / 패러데이 실험실)',
    nameEn: 'The Royal Institution (Albemarle Street)',
    category: 'landmark',
    categoryLabel: '학술 & 산업 랜드마크',
    lat: 51.5097,
    lng: -0.1425,
    period: '1820–1870년대',
    victorianAddress: '21 Albemarle Street, Mayfair, London',
    modernAddress: '21 Albemarle Street, London W1S 4BS',
    summary: '마이클 패러데이와 험프리 데이비의 연구 기지. 배비지는 이곳에서 차분기관과 정밀 기계 공학 원리를 대중에게 시연·강연했습니다.',
    significance: '전자기학과 정밀 기계 계산학이 활발히 교류하던 19세기 과학 소통의 메카.',
    connections: ['도싯 가 1번지', '벌링턴 하우스']
  },
  {
    id: 'crystal-palace',
    name: '1851년 런던 만국박람회 (하이드 파크 수정궁)',
    nameEn: 'Great Exhibition of 1851 (Crystal Palace)',
    category: 'landmark',
    categoryLabel: '학술 & 산업 랜드마크',
    lat: 51.5033,
    lng: -0.1695,
    period: '1851년 5월–10월',
    victorianAddress: 'Crystal Palace, Hyde Park, London',
    modernAddress: 'Hyde Park (opposite Royal Albert Hall), London SW7',
    summary: '조셉 팩스턴의 유리 수정궁에서 열린 인류 최초의 만국박람회. 왕립 조직위가 배비지의 기계 전시를 거부하자, 배비지는 『1851년 박람회론』을 발표하며 정부를 격렬히 규탄했습니다.',
    quote: '박람회 기계관에서 마르크스는 자동 방적기와 증기 터빈을 며칠 동안 관찰했고, 배비지는 관료주의적 배제에 맞서 기술 철학을 외쳤다.',
    significance: '마르크스가 기계공학 실물을 집중 조사하고 배비지의 분노가 폭발한 19세기 산업주의의 정점.',
    connections: ['도싯 가 1번지', '1862년 만국박람회', '대영박물관 열람실']
  },
  {
    id: 'exhibition-1862',
    name: '1862년 런던 만국박람회 (사우스 켄싱턴)',
    nameEn: '1862 International Exhibition (South Kensington)',
    category: 'landmark',
    categoryLabel: '학술 & 산업 랜드마크',
    lat: 51.4965,
    lng: -0.1764,
    period: '1862년 5월–11월',
    victorianAddress: 'Exhibition Grounds, South Kensington, London',
    modernAddress: 'Exhibition Road / Cromwell Road (현 과학박물관/자연사박물관 부지)',
    summary: '1832년 완성된 배비지의 차분기관 1호 시제품이 서부 기계관에 당당히 공식 전시된 박람회. 마르크스는 이 박람회를 참관하며 『1861-1863년 경제학 초고』의 기계론 챕터를 보강했습니다.',
    significance: '현재 런던 과학박물관(Science Museum)의 계산기계 영구 보존으로 이어진 계기.',
    connections: ['1851년 만국박람회', '조셉 클레먼트 공방', '대영박물관 열람실']
  },
  {
    id: 'greenwich-observatory',
    name: '그리니치 왕립천문대',
    nameEn: 'Greenwich Royal Observatory',
    category: 'landmark',
    categoryLabel: '학술 & 산업 랜드마크',
    lat: 51.4769,
    lng: -0.0005,
    period: '1820년대',
    victorianAddress: 'Greenwich Park, London',
    modernAddress: 'Blackheath Avenue, Greenwich, London SE10 8XJ',
    summary: '본초자오선(0° 0\' 0")이 위치한 세계 천문 항해의 기준점. 영국 해군본부 『항해역서(Nautical Almanac)』의 수많은 수작업 수표 오류가 배비지로 하여금 "신이여, 이 계산들이 증기(기계)로 이루어졌으면 좋으련만!"이라고 외치게 만든 근원지입니다.',
    significance: '차분기관 탄생의 직접적 동기(수표의 오류 제거)를 부여한 장소.',
    connections: ['도싯 가 1번지', '소머싯 하우스']
  },
  {
    id: 'admiralty-museum',
    name: '소머싯 하우스 해군박물관 (Admiralty Museum)',
    nameEn: 'Admiralty Museum at Somerset House',
    category: 'landmark',
    categoryLabel: '학술 & 산업 랜드마크',
    lat: 51.5113,
    lng: -0.1165,
    period: '1830년대',
    victorianAddress: 'Somerset House, Strand, London',
    modernAddress: 'Strand, London WC2R 1LA',
    summary: '헨리 모즐리가 포츠머스 도크야드를 위해 제작한 전설적인 활차 블록 가공 기계들이 전시된 곳. 배비지의 기계 표기법과 일관 생산 시스템의 직접적 모델이 되었습니다.',
    significance: '영국 기계공구 산업과 군사·재정 국가(Fiscal-military state)의 정밀 기술 과시장.',
    connections: ['조셉 클레먼트 공방', '소머싯 하우스']
  },
  {
    id: 'adelaide-gallery',
    name: '애들레이드 갤러리 (Adelaide Gallery)',
    nameEn: 'Adelaide Gallery of Practical Science',
    category: 'landmark',
    categoryLabel: '학술 & 산업 랜드마크',
    lat: 51.5098,
    lng: -0.1245,
    period: '1834년',
    victorianAddress: 'Lowther Arcade, Strand, London',
    modernAddress: 'Strand / William IV Street area, London WC2',
    summary: '전기학자이자 쇼맨 프랜시스 왓킨스가 제작한 2대의 차분기관 작동 모형과 자카드 직조기가 일반 대중과 상류층에게 시연된 런던 최고의 신기술 쇼룸입니다.',
    significance: '웨스트엔드 대중에게 기계 지능과 자동화의 경이를 교육·선전하던 중심 무대.',
    connections: ['도싯 가 1번지', '킹스 칼리지 런던 박물관']
  },
  {
    id: 'kings-college-museum',
    name: '킹스 칼리지 런던 박물관 (차분기관 1호 전시)',
    nameEn: "King's College London Museum",
    category: 'landmark',
    categoryLabel: '학술 & 산업 랜드마크',
    lat: 51.5118,
    lng: -0.116,
    period: '1843년 이후',
    victorianAddress: "King's College, Strand, London",
    modernAddress: "Strand Building, King's College London, WC2R 2LS",
    summary: '1834년 클레먼트와의 결렬로 정부가 차분기관 1호 프로젝트를 중단한 후, 조립된 1832년 시험 모델이 보존·공개 전시된 대학 박물관입니다.',
    significance: '배비지의 계산 기계가 국가적 기념비로서 대중의 시선 속에 영구 안치된 공간.',
    connections: ['소머싯 하우스', '1862년 만국박람회']
  },
  {
    id: 'finsbury-hustings',
    name: '핀스버리 선거구 유세장 (Finsbury Hustings)',
    nameEn: 'Finsbury Parliamentary Hustings',
    category: 'landmark',
    categoryLabel: '학술 & 산업 랜드마크',
    lat: 51.524,
    lng: -0.105,
    period: '1832년 12월',
    victorianAddress: 'Finsbury Borough Hustings, Northeast London',
    modernAddress: 'Clerkenwell Green / Finsbury area, London EC1',
    summary: '배비지가 의회 개혁법 통과 후 과학자 대표로 출마했던 급진파 노동자 선거구. 차티스트와 노동자들로부터 "기계가 인간을 도구로 만든다"는 거센 항의를 받았습니다.',
    quote: '노동자들은 우리를 도구와 기계로 만들려는 선거 운동에 맞서 분연히 저항했다.',
    quoteSource: '1832년 핀스버리 급진파 신문',
    significance: '배비지의 기술 관료적 이상과 노동자 계급의 기계 파괴/차티스트 운동이 정면 충돌한 정치적 현장.',
    connections: ['도싯 가 1번지', '대영박물관 열람실']
  }
];

export default function VictorianLondonMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLocation, setActiveLocation] = useState<LocationItem | null>(LOCATIONS[1]); // Default to Dorset St
  const [mapStyle, setMapStyle] = useState<'voyager' | 'nls' | 'osm'>('voyager');
  const [isLeafletReady, setIsLeafletReady] = useState<boolean>(false);

  // Filter locations
  const filteredLocations = LOCATIONS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.victorianAddress.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Dynamic Leaflet CSS & JS Loader
  useEffect(() => {
    let isMounted = true;

    async function initLeaflet() {
      // 1. Ensure Leaflet CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // 2. Ensure Leaflet JS
      if (!(window as any).L) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      if (isMounted) {
        setIsLeafletReady(true);
      }
    }

    initLeaflet();

    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!isLeafletReady || !mapContainerRef.current || mapInstanceRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    // Create Map instance centered around Central London
    const map = L.map(mapContainerRef.current, {
      center: [51.515, -0.14],
      zoom: 13,
      minZoom: 10,
      maxZoom: 18,
      zoomControl: false,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    mapInstanceRef.current = map;

    // Apply Tile Layer
    updateTileLayer(map, 'voyager');

    // Create Marker Layers
    renderMarkers(map);

    // Resize invalidate trigger
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [isLeafletReady]);

  // Tile layer updater
  const updateTileLayer = (map: any, style: 'voyager' | 'nls' | 'osm') => {
    const L = (window as any).L;
    if (!map || !L) return;

    // Remove existing tile layers
    map.eachLayer((layer: any) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    if (style === 'voyager') {
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
      }).addTo(map);
    } else if (style === 'nls') {
      // Base OSM layer + NLS 1890s overlay
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map);
      L.tileLayer('https://mapseries-tilesets.s3.amazonaws.com/os/london_1890s/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 10,
        opacity: 0.85,
        attribution: '&copy; National Library of Scotland (NLS) Historical Town Plans',
      }).addTo(map);
    } else {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);
    }
  };

  // Switch Tile Style
  const handleMapStyleChange = (style: 'voyager' | 'nls' | 'osm') => {
    setMapStyle(style);
    if (mapInstanceRef.current) {
      updateTileLayer(mapInstanceRef.current, style);
    }
  };

  // Render Markers
  const renderMarkers = (map: any) => {
    const L = (window as any).L;
    if (!map || !L) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker: any) => marker.remove());
    markersRef.current = {};

    LOCATIONS.forEach((loc) => {
      // Color coding & icon
      let badgeBg = '#d97706'; // brass amber
      let iconSymbol = '⚙️';
      if (loc.category === 'lovelace') {
        badgeBg = '#9333ea'; // purple
        iconSymbol = '✨';
      } else if (loc.category === 'marx') {
        badgeBg = '#e11d48'; // red rose
        iconSymbol = '📜';
      } else if (loc.category === 'landmark') {
        badgeBg = '#059669'; // emerald
        iconSymbol = '🏛️';
      }

      const customIcon = L.divIcon({
        className: 'custom-babbage-pin',
        html: `
          <div style="
            background: ${badgeBg};
            color: #fff;
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
            border: 2px solid #ffffff;
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            <span style="transform: rotate(45deg); font-size: 14px; user-select: none;">
              ${iconSymbol}
            </span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(map);

      // Popup Content
      const popupHtml = `
        <div style="font-family: inherit; max-width: 260px; color: #1e293b; padding: 2px;">
          <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: ${badgeBg}; letter-spacing: 0.5px; margin-bottom: 2px;">
            ${loc.categoryLabel} (${loc.period})
          </div>
          <div style="font-size: 14px; font-weight: bold; margin-bottom: 4px; color: #0f172a;">
            ${loc.name}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px; font-style: italic;">
            📍 ${loc.victorianAddress}
          </div>
          <div style="font-size: 12px; line-height: 1.4; color: #334155; margin-bottom: 6px;">
            ${loc.summary}
          </div>
          ${
            loc.quote
              ? `<div style="font-size: 11px; font-style: italic; background: #f8fafc; border-left: 3px solid ${badgeBg}; padding: 4px 6px; margin-top: 4px; border-radius: 0 4px 4px 0;">
                  "${loc.quote}"
                </div>`
              : ''
          }
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        setActiveLocation(loc);
      });

      markersRef.current[loc.id] = marker;
    });
  };

  // Center on location
  const handleSelectLocation = (loc: LocationItem) => {
    setActiveLocation(loc);
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([loc.lat, loc.lng], 15, { duration: 1.2 });
      const marker = markersRef.current[loc.id];
      if (marker) {
        marker.openPopup();
      }
    }
  };

  // Reset View
  const handleResetView = () => {
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([51.515, -0.14], 13, { duration: 1.0 });
    }
  };

  return (
    <div className="w-full bg-[#0d1015] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Control Bar: Categories & Styles */}
      <div className="p-4 sm:p-5 bg-[#12161f] border-b border-gray-800/80 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 whitespace-nowrap min-h-[36px] ${
              selectedCategory === 'all'
                ? 'bg-brass-500 text-iron-950 font-bold shadow-md shadow-brass-500/20'
                : 'bg-[#181e28] text-gray-300 hover:text-white border border-gray-700/60'
            }`}
          >
            <span>전체 거점</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 font-bold">{LOCATIONS.length}</span>
          </button>
          <button
            onClick={() => setSelectedCategory('babbage')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 whitespace-nowrap min-h-[36px] ${
              selectedCategory === 'babbage'
                ? 'bg-amber-500 text-iron-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-[#181e28] text-gray-300 hover:text-amber-300 border border-gray-700/60'
            }`}
          >
            <span>⚙️ 찰스 배비지</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 font-bold">
              {LOCATIONS.filter((i) => i.category === 'babbage').length}
            </span>
          </button>
          <button
            onClick={() => setSelectedCategory('lovelace')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 whitespace-nowrap min-h-[36px] ${
              selectedCategory === 'lovelace'
                ? 'bg-purple-500 text-white font-bold shadow-md shadow-purple-500/20'
                : 'bg-[#181e28] text-gray-300 hover:text-purple-300 border border-gray-700/60'
            }`}
          >
            <span>✨ 에이다 러브레이스</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 font-bold">
              {LOCATIONS.filter((i) => i.category === 'lovelace').length}
            </span>
          </button>
          <button
            onClick={() => setSelectedCategory('marx')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 whitespace-nowrap min-h-[36px] ${
              selectedCategory === 'marx'
                ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/20'
                : 'bg-[#181e28] text-gray-300 hover:text-rose-300 border border-gray-700/60'
            }`}
          >
            <span>📜 칼 마르크스</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 font-bold">
              {LOCATIONS.filter((i) => i.category === 'marx').length}
            </span>
          </button>
          <button
            onClick={() => setSelectedCategory('landmark')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 whitespace-nowrap min-h-[36px] ${
              selectedCategory === 'landmark'
                ? 'bg-emerald-500 text-iron-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-[#181e28] text-gray-300 hover:text-emerald-300 border border-gray-700/60'
            }`}
          >
            <span>🏛️ 학술 & 산업 랜드마크</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 font-bold">
              {LOCATIONS.filter((i) => i.category === 'landmark').length}
            </span>
          </button>
        </div>

        {/* Map Tile Style Switcher & Search */}
        <div className="flex items-center gap-3">
          {/* Map Layer Switch */}
          <div className="inline-flex items-center bg-[#0d1015] p-1 rounded-lg border border-gray-800">
            <button
              onClick={() => handleMapStyleChange('voyager')}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                mapStyle === 'voyager' ? 'bg-brass-500/20 text-brass-300 font-bold' : 'text-gray-400 hover:text-gray-200'
              }`}
              title="우아한 빈티지 양피지 톤"
            >
              양피지 톤
            </button>
            <button
              onClick={() => handleMapStyleChange('nls')}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                mapStyle === 'nls' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-gray-400 hover:text-gray-200'
              }`}
              title="1890년대 빅토리아 실측 지도 (NLS)"
            >
              1890s 빅토리아
            </button>
            <button
              onClick={() => handleMapStyleChange('osm')}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                mapStyle === 'osm' ? 'bg-blue-500/20 text-blue-300 font-bold' : 'text-gray-400 hover:text-gray-200'
              }`}
              title="현대 표준 오픈스트리트맵"
            >
              현대 OSM
            </button>
          </div>

          {/* Reset Zoom Button */}
          <button
            onClick={handleResetView}
            className="p-2 rounded-lg bg-[#181e28] border border-gray-800 text-gray-300 hover:text-white hover:border-gray-700 transition-colors"
            title="런던 전체 뷰로 재설정"
          >
            <Compass className="w-4 h-4 text-brass-400" />
          </button>
        </div>
      </div>

      {/* Main Container: Map (Left/Center) + Detail Drawer (Right/Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[550px] lg:min-h-[640px]">
        {/* Interactive Leaflet Map Container */}
        <div className="lg:col-span-7 xl:col-span-8 relative bg-[#090b0e] h-[380px] sm:h-[460px] lg:h-auto">
          {!isLeafletReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0d1015]/90 text-gray-400 font-mono text-sm z-10">
              <div className="flex items-center gap-2">
                <span className="animate-spin text-brass-400">⚙️</span>
                빅토리아 런던 사료 지도 로딩 중...
              </div>
            </div>
          )}
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Map Overlay Badge */}
          <div className="absolute bottom-3 left-3 z-[400] bg-[#0f1115]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-800 text-[11px] font-mono text-gray-300 shadow-lg pointer-events-none hidden sm:block">
            <span className="text-brass-400 font-bold">📍 런던 메릴본 ↔ 블룸즈버리</span> : 약 2.4km (1.5 miles)
          </div>
        </div>

        {/* Location List & Active Detail Sidebar */}
        <div className="lg:col-span-5 xl:col-span-4 bg-[#12161f] border-t lg:border-t-0 lg:border-l border-gray-800 flex flex-col h-[460px] lg:h-[640px]">
          {/* Search Box */}
          <div className="p-3.5 border-b border-gray-800 bg-[#0e1117]">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="장소명, 주소, 인물 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#181e28] border border-gray-700/80 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-gray-200 placeholder-gray-500 focus:outline-none focus:border-brass-400"
              />
            </div>
          </div>

          {/* Active Location Detail Card (Top Sticky in Sidebar) */}
          {activeLocation && (
            <div className="p-4 bg-[#181e28] border-b border-gray-800/80 transition-all">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                    activeLocation.category === 'babbage'
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                      : activeLocation.category === 'lovelace'
                      ? 'bg-purple-950/80 text-purple-300 border border-purple-500/40'
                      : activeLocation.category === 'marx'
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                      : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {activeLocation.categoryLabel} · {activeLocation.period}
                </span>
                <span className="text-[10px] font-mono text-gray-400">
                  {activeLocation.lat.toFixed(4)}, {activeLocation.lng.toFixed(4)}
                </span>
              </div>

              <h3 className="text-base font-bold text-white font-display mb-1">{activeLocation.name}</h3>
              <p className="text-xs text-brass-300/90 font-mono mb-2">{activeLocation.nameEn}</p>

              <div className="text-xs text-gray-300 font-body-serif leading-relaxed mb-3">
                {activeLocation.summary}
              </div>

              {activeLocation.quote && (
                <div className="p-2.5 bg-[#0d1015] border-l-2 border-brass-400 rounded-r text-xs font-body-serif italic text-gray-300 mb-3">
                  "{activeLocation.quote}"
                  {activeLocation.quoteSource && (
                    <div className="text-[10px] text-gray-400 font-sans not-italic text-right mt-1">
                      — {activeLocation.quoteSource}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-1 text-[11px] font-mono text-gray-400 bg-[#0d1015] p-2.5 rounded border border-gray-800">
                <div>
                  <span className="text-gray-500">빅토리아 주소:</span> {activeLocation.victorianAddress}
                </div>
                <div>
                  <span className="text-gray-500">현대 주소:</span> {activeLocation.modernAddress}
                </div>
                <div>
                  <span className="text-gray-500">사료적 의의:</span>{' '}
                  <span className="text-gray-300">{activeLocation.significance}</span>
                </div>
              </div>
            </div>
          )}

          {/* Filtered Location List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-gray-800/40">
            <div className="text-[11px] font-mono text-gray-400 px-1 py-1 flex items-center justify-between">
              <span>검색된 거점 ({filteredLocations.length}개)</span>
              <span className="text-[10px] text-gray-500">클릭 시 지도 이동</span>
            </div>

            {filteredLocations.map((item) => {
              const isSelected = activeLocation?.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectLocation(item)}
                  className={`w-full text-left p-2.5 rounded-lg transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-brass-500/15 border border-brass-500/40 text-white'
                      : 'hover:bg-[#181e28] text-gray-300 border border-transparent'
                  }`}
                >
                  <span className="text-lg mt-0.5">
                    {item.category === 'babbage'
                      ? '⚙️'
                      : item.category === 'lovelace'
                      ? '✨'
                      : item.category === 'marx'
                      ? '📜'
                      : '🏛️'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold font-sans text-gray-100 truncate">{item.name}</span>
                      <span className="text-[10px] font-mono text-gray-500 shrink-0">{item.period.split(' ')[0]}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{item.victorianAddress}</p>
                  </div>
                </button>
              );
            })}

            {filteredLocations.length === 0 && (
              <div className="py-8 text-center text-xs font-mono text-gray-500">일치하는 역사 거점이 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
