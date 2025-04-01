const timeElement = document.getElementById('time');
const params = new URLSearchParams(window.location.search);
const options = { year: 'numeric', month: 'numeric', day: 'numeric' };

function setClock() {
  const date = new Date();
  if (timeElement) {
    timeElement.innerHTML = `Czas: ${date.toTimeString().split(' ')[0]} ${date.toLocaleDateString('pl-PL', options)}`;
  }
}

setClock();
setInterval(setClock, 1000);

let webManifest = {
  name: '',
  short_name: '',
  theme_color: '#f5f6fb',
  background_color: '#f5f6fb',
  display: 'standalone',
};

function getMobileOperatingSystem() {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('windows phone')) return 1;
  if (userAgent.includes('android')) return 2;
  if (/ipad|iphone|ipod/.test(userAgent) && !window.MSStream) return 3;
  return 4;
}

if (getMobileOperatingSystem() === 2) {
  const bottomBar = document.querySelector('.bottom_bar');
  if (bottomBar) bottomBar.style.height = '70px';
}

const manifestLink = document.createElement('link');
manifestLink.rel = 'manifest';
manifestLink.href = `data:application/manifest+json;base64,${btoa(JSON.stringify(webManifest))}`;
document.head.prepend(manifestLink);

const unfoldElement = document.querySelector('.info_holder');
if (unfoldElement) {
  unfoldElement.addEventListener('click', () => {
    unfoldElement.classList.toggle('unfolded');
  });
}

const imageParam = params.get('image');
if (imageParam) {
  const idImage = document.querySelector('.id_own_image');
  if (idImage) idImage.style.backgroundImage = `url(${imageParam})`;
}

const setData = (id, value) => {
  const element = document.getElementById(id);
  if (element && value) element.innerHTML = value;
};

setData('name', params.get('name')?.toUpperCase());
setData('surname', params.get('surname')?.toUpperCase());
setData('nationality', params.get('nationality')?.toUpperCase());
setData('birthday', params.get('birthday'));
setData('familyName', params.get('familyName'));
setData('sex', params.get('sex'));
setData('fathersFamilyName', params.get('fathersFamilyName'));
setData('mothersFamilyName', params.get('mothersFamilyName'));
setData('birthPlace', params.get('birthPlace'));
setData('countryOfBirth', params.get('countryOfBirth'));

const address = [
  params.get('adress1') ? `ul. ${params.get('adress1')}` : '',
  params.get('adress2'),
  params.get('city'),
].filter(Boolean).join('<br>');

setData('adress', address);
setData('checkInDate', params.get('checkInDate'));

const birthday = params.get('birthday');
const sex = params.get('sex');

if (birthday) {
  const birthdayParts = birthday.split('.').map(Number);
  if (birthdayParts.length === 3) {
    const [day, month, year] = birthdayParts;
    const adjustedMonth = year >= 2000 ? 20 + month : month;
    const peselSuffix = sex?.toLowerCase() === 'mężczyzna' ? '0295' : '0382';
    const pesel = `${year % 100}${String(adjustedMonth).padStart(2, '0')}${String(day).padStart(2, '0')}${peselSuffix}7`;
    setData('pesel', pesel);
  }
}
