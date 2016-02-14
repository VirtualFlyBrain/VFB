/*! VirtualFlyBrain.org functions to manage image stack */

window.selPointX = 0;
window.selPointY = 0;
window.selPointZ = 0;
window.reloadInterval = 10;
window.id = '0-0-0-0';
var lastkey = Date.now();
var searchDelayed = false;
var detailLoad = false;
var checkCount = 0;
var cookieMax = 4000;
var dropItems = 0;
var searchresults = [];
var engine = new Bloodhound({
    datumTokenizer: function (d) {
        return Bloodhound.tokenizers.nonword(d.syn.replace('_', ' '));
    },
    queryTokenizer: function (d) {
        return Bloodhound.tokenizers.nonword(d.replace('_', ' '));
    },
    local: searchresults,
    limit: 20,
    sorter: function (a, b) {
        //get input string
        var InputString = $('#searchtext').val();
        //move exact matches to top
        if (InputString == a.syn) {
            return -1;
        }
        if (InputString == b.syn) {
            return 1;
        }
        //close match without case matching
        if (InputString.toLowerCase() == a.syn.toLowerCase()) {
            return -1;
        }
        if (InputString.toLowerCase() == b.syn.toLowerCase()) {
            return 1;
        }
        //match ignoring joinging nonwords
        Bloodhound.tokenizers.nonword("test thing-here12 34f").join(' ');
        if (Bloodhound.tokenizers.nonword(InputString.toLowerCase()).join(' ') == Bloodhound.tokenizers.nonword(a.syn.toLowerCase()).join(' ')) {
            return -1;
        }
        if (Bloodhound.tokenizers.nonword(InputString.toLowerCase()).join(' ') == Bloodhound.tokenizers.nonword(b.syn.toLowerCase()).join(' ')) {
            return 1;
        }
        //match against id
        if (InputString.toLowerCase() == a.id.toLowerCase()) {
            return -1;
        }
        if (InputString.toLowerCase() == b.id.toLowerCase()) {
            return 1;
        }
        //pick up any match without nonword join character match
        if (Bloodhound.tokenizers.nonword(a.syn.toLowerCase()).join(' ').indexOf(Bloodhound.tokenizers.nonword(InputString.toLowerCase()).join(' ')) < 0 && Bloodhound.tokenizers.nonword(b.syn.toLowerCase()).join(' ').indexOf(Bloodhound.tokenizers.nonword(InputString.toLowerCase()).join(' ')) > -1) {
            return 1;
        }
        if (Bloodhound.tokenizers.nonword(b.syn.toLowerCase()).join(' ').indexOf(Bloodhound.tokenizers.nonword(InputString.toLowerCase()).join(' ')) < 0 && Bloodhound.tokenizers.nonword(a.syn.toLowerCase()).join(' ').indexOf(Bloodhound.tokenizers.nonword(InputString.toLowerCase()).join(' ')) > -1) {
            return -1;
        }
        //also with underscores ignored
        if (Bloodhound.tokenizers.nonword(a.syn.toLowerCase()).join(' ').replace('_', ' ').indexOf(Bloodhound.tokenizers.nonword(InputString.toLowerCase()).join(' ').replace('_', ' ')) < 0 && Bloodhound.tokenizers.nonword(b.syn.toLowerCase()).join(' ').replace('_', ' ').indexOf(Bloodhound.tokenizers.nonword(InputString.toLowerCase()).join(' ').replace('_', ' ')) > -1) {
            return 1;
        }
        if (Bloodhound.tokenizers.nonword(b.syn.toLowerCase()).join(' ').replace('_', ' ').indexOf(Bloodhound.tokenizers.nonword(InputString.toLowerCase()).join(' ').replace('_', ' ')) < 0 && Bloodhound.tokenizers.nonword(a.syn.toLowerCase()).join(' ').replace('_', ' ').indexOf(Bloodhound.tokenizers.nonword(InputString.toLowerCase()).join(' ').replace('_', ' ')) > -1) {
            return -1;
        }
        //if not found in one then advance the other
        if (a.syn.toLowerCase().indexOf(InputString.toLowerCase()) < 0 && b.syn.toLowerCase().indexOf(InputString.toLowerCase()) > -1) {
            return 1;
        }
        if (b.syn.toLowerCase().indexOf(InputString.toLowerCase()) < 0 && a.syn.toLowerCase().indexOf(InputString.toLowerCase()) > -1) {
            return -1;
        }
        // if the match is closer to start than the other move up
        if (a.syn.toLowerCase().indexOf(InputString.toLowerCase()) > -1 && a.syn.toLowerCase().indexOf(InputString.toLowerCase()) < b.syn.toLowerCase().indexOf(InputString.toLowerCase())) {
            return -1;
        }
        if (b.syn.toLowerCase().indexOf(InputString.toLowerCase()) > -1 && b.syn.toLowerCase().indexOf(InputString.toLowerCase()) < a.syn.toLowerCase().indexOf(InputString.toLowerCase())) {
            return 1;
        }
        // if the match in the id is closer to start then move up
        if (a.id.toLowerCase().indexOf(InputString.toLowerCase()) > -1 && a.id.toLowerCase().indexOf(InputString.toLowerCase()) < b.id.toLowerCase().indexOf(InputString.toLowerCase())) {
            return -1;
        }
        if (b.id.toLowerCase().indexOf(InputString.toLowerCase()) > -1 && b.id.toLowerCase().indexOf(InputString.toLowerCase()) < a.id.toLowerCase().indexOf(InputString.toLowerCase())) {
            return 1;
        }
        // move the shorter synonyms to the top
        if (a.syn < b.syn) {
            return -1;
        }
        else if (a.syn > b.syn) {
            return 1;
        }
        else return 0; // if nothing found then do nothing.
    }
});
var CompKey = ['"}}}}', '"},"', '":{"', '{"', '","', '":{"', '":"', '":', '},"', ',"'];
var CompMax = {
    A: '!4scl!71!9mod!6zeta!4slice!6Z!4dst!70!9pit!70!9yaw!70!9rol!70!9qlt!780!9cvt!6png!4fxp!6',
    B: 'VFBt_001!2S!20!2i!6VFBt_00100000!4N!6Janelia Adult Brain',
    C: 'VFBt_002!2S!20!2i!6VFBt_00200000!4N!6Ito Half Brain',
    c1c: 'i!6VFBd_00100024!4e!6FBbt_00007401!1',
    c2c: '!2i!6VFBd_00100023!4e!6FBbt_00003678!1',
    c3c: '!2i!6VFBd_00100026!4e!6FBbt_00003679!1',
    c4c: '!2i!6VFBd_00100004!4e!6FBbt_00003680!1',
    c5c: '!2i!6VFBd_00100006!4e!6FBbt_00003668!1',
    c6c: '!2i!6VFBd_00100017!4e!6FBbt_00007453!1',
    c7c: '!2i!6VFBd_00100036!4e!6FBbt_00007385!1',
    c8c: '!2i!6VFBd_00100019!4e!6FBbt_00007677!1',
    c9c: '!2i!6VFBd_00100018!4e!6FBbt_00015407!1',
    c10c: '!2i!6VFBd_00100015!4e!6FBbt_00045039!1',
    c11c: '!2i!6VFBd_00100012!4e!6FBbt_00040049!1',
    c12c: '!2i!6VFBd_00100039!4e!6FBbt_00040048!1',
    c13c: '!2i!6VFBd_00100016!4e!6FBbt_00045037!1',
    c14c: '!2i!6VFBd_00100014!4e!6FBbt_00040050!1',
    c15c: '!2i!6VFBd_00100005!4e!6FBbt_00003682!1',
    c16c: '!2i!6VFBd_00100008!4e!6FBbt_00003681!1',
    c17c: '!2i!6VFBd_00100051!4e!6FBbt_00040060!1',
    c18c: '!2i!6VFBd_00100007!4e!6FBbt_00007053!1',
    c19c: '!2i!6VFBd_00100003!4e!6FBbt_00003852!1',
    c20c: '!2i!6VFBd_00100022!4e!6FBbt_00003885!1',
    c21c: '!2i!6VFBd_00100025!4e!6FBbt_00003748!1',
    c22c: '!2i!6VFBd_00100002!4e!6FBbt_00045003!1',
    c23c: '!2i!6VFBd_00100028!4e!6FBbt_00045032!1',
    c24c: '!2i!6VFBd_00100027!4e!6FBbt_00007054!1',
    c25c: '!2i!6VFBd_00100029!4e!6FBbt_00007055!1',
    c26c: '!2i!6VFBd_00100034!4e!6FBbt_00007059!1',
    c27c: '!2i!6VFBd_00100033!4e!6FBbt_00040044!1',
    c28c: '!2i!6VFBd_00100030!4e!6FBbt_00040043!1',
    c29c: '!2i!6VFBd_00100032!4e!6FBbt_00045027!1',
    c30c: '!2i!6VFBd_00100031!4e!6FBbt_00040042!1',
    c31c: '!2i!6VFBd_00100038!4e!6FBbt_00045046!1',
    c32c: '!2i!6VFBd_00100037!4e!6FBbt_00045040!1',
    c33c: '!2i!6VFBd_00100040!4e!6FBbt_00040040!1',
    c34c: '!2i!6VFBd_00100035!4e!6FBbt_00040039!1',
    c35c: '!2i!6VFBd_00100013!4e!6FBbt_00040041!1',
    c36c: '!2i!6VFBd_00100010!4e!6FBbt_00045051!1',
    c37c: '!2i!6VFBd_00100020!4e!6FBbt_00045050!1',
    c38c: '!2i!6VFBd_00100009!4e!6FBbt_00045048!1',
    c39c: '!2i!6VFBd_00100011!4e!6FBbt_00003982!1',
    c40c: '!2i!6VFBd_00100049!4e!6FBbt_00014013!1',
    c41c: '!2i!6VFBd_00100050!4e!6FBbt_00040051',
    d1d: '!2i!6VFBd_00200023!4e!6FBbt_00007401!1',
    d2d: '!2i!6VFBd_00200022!4e!6FBbt_00003678!1',
    d3d: '!2i!6VFBd_00200025!4e!6FBbt_00003679!1',
    d4d: '!2i!6VFBd_00200003!4e!6FBbt_00003680!1',
    d5d: '!2i!6VFBd_00200005!4e!6FBbt_00003668!1',
    d6d: '!2i!6VFBd_00200016!4e!6FBbt_00007453!1',
    d7d: '!2i!6VFBd_00200035!4e!6FBbt_00007385!1',
    d8d: '!2i!6VFBd_00200018!4e!6FBbt_00007677!1',
    d9d: '!2i!6VFBd_00200017!4e!6FBbt_00015407!1',
    d10d: '!2i!6VFBd_00200020!4e!6FBbt_00045007!1',
    d11d: '!2i!6VFBd_00200014!4e!6FBbt_00045039!1',
    d12d: '!2i!6VFBd_00200011!4e!6FBbt_00040049!1',
    d13d: '!2i!6VFBd_00200038!4e!6FBbt_00040048!1',
    d14d: '!2i!6VFBd_00200015!4e!6FBbt_00045037!1',
    d15d: '!2i!6VFBd_00200013!4e!6FBbt_00040050!1',
    d16d: '!2i!6VFBd_00200004!4e!6FBbt_00003682!1',
    d17d: '!2i!6VFBd_00200007!4e!6FBbt_00003681!1',
    d18d: '!2i!6VFBd_00200006!4e!6FBbt_00007053!1',
    d19d: '!2i!6VFBd_00200002!4e!6FBbt_00003852!1',
    d20d: '!2i!6VFBd_00200021!4e!6FBbt_00003885!1',
    d21d: '!2i!6VFBd_00200024!4e!6FBbt_00003748!1',
    d22d: '!2i!6VFBd_00200001!4e!6FBbt_00045003!1',
    d23d: '!2i!6VFBd_00200027!4e!6FBbt_00045032!1',
    d24d: '!2i!6VFBd_00200026!4e!6FBbt_00007054!1',
    d25d: '!2i!6VFBd_00200028!4e!6FBbt_00007055!1',
    d26d: '!2i!6VFBd_00200033!4e!6FBbt_00007059!1',
    d27d: '!2i!6VFBd_00200032!4e!6FBbt_00040044!1',
    d28d: '!2i!6VFBd_00200029!4e!6FBbt_00040043!1',
    d29d: '!2i!6VFBd_00200031!4e!6FBbt_00045027!1',
    d30d: '!2i!6VFBd_00200030!4e!6FBbt_00040042!1',
    d31d: '!2i!6VFBd_00200037!4e!6FBbt_00045046!1',
    d32d: '!2i!6VFBd_00200036!4e!6FBbt_00045040!1',
    d33d: '!2i!6VFBd_00200039!4e!6FBbt_00040040!1',
    d34d: '!2i!6VFBd_00200034!4e!6FBbt_00040039!1',
    d35d: '!2i!6VFBd_00200012!4e!6FBbt_00040041!1',
    d36d: '!2i!6VFBd_00200009!4e!6FBbt_00045051!1',
    d37d: '!2i!6VFBd_00200019!4e!6FBbt_00045050!1',
    d38d: '!2i!6VFBd_00200008!4e!6FBbt_00045048!1',
    d39d: '!2i!6VFBd_00200010!4e!6FBbt_00003982!1',
    d40d: '!2i!6VFBd_00200048!4e!6FBbt_00014013!1',
    d41d: '!2i!6VFBd_00200049!4e!6FBbt_00040051!1',
    d42d: '!2i!6VFBd_00200043!4e!6FBbt_00007080!1',
    d43d: '!2i!6VFBd_00200040!4e!6FBbt_00003985!1',
    d44d: '!2i!6VFBd_00200046!4e!6FBbt_00004043!1',
    d45d: '!2i!6VFBd_00200041!4e!6FBbt_00100337!1',
    d46d: '!2i!6VFBd_00200044!4e!6FBbt_00110653!1',
    d47d: '!2i!6VFBd_00200047!4e!6FBbt_00004020!1',
    d48d: '!2i!6VFBd_00200328!4e!6FBbt_00007354!1',
    d49d: '!2i!6VFBd_00200321!4e!6FBbt_00100346!1',
    d50d: '!2i!6VFBd_00200343!4e!6FBbt_00007072!1',
    d51d: '!2i!6VFBd_00200307!4e!6FBbt_00100339!1',
    d52d: '!2i!6VFBd_00200325!4e!6FBbt_00100340!1',
    d53d: '!2i!6VFBd_00200322!4e!6FBbt_00100352!1',
    d54d: '!2i!6VFBd_00200312!4e!6FBbt_00100350!1',
    d55d: '!2i!6VFBd_00200318!4e!6FBbt_00007074!1',
    d56d: '!2i!6VFBd_00200306!4e!6FBbt_00003983!1',
    d57d: '!2i!6VFBd_00200327!4e!6FBbt_00100347!1',
    d58d: '!2i!6VFBd_00200315!4e!6FBbt_00100343!1',
    d59d: '!2i!6VFBd_00200320!4e!6FBbt_00100345!1',
    d60d: '!2i!6VFBd_00200314!4e!6FBbt_00100342!1',
    d61d: '!2i!6VFBd_00200308!4e!6FBbt_00003683!1',
    d62d: '!2i!6VFBd_00200305!4e!6FBbt_00003984!1',
    d63d: '!2i!6VFBd_00200319!4e!6FBbt_00100344!1',
    d64d: '!2i!6VFBd_00200323!4e!6FBbt_00007083!1',
    d65d: '!2i!6VFBd_00200303!4e!6FBbt_00007427!1',
    d66d: '!2i!6VFBd_00200338!4e!6FBbt_00100355!1',
    d67d: '!2i!6VFBd_00200324!4e!6FBbt_00100338!1',
    d68d: '!2i!6VFBd_00200337!4e!6FBbt_00100357!1',
    d69d: '!2i!6VFBd_00200345!4e!6FBbt_00100351!1',
    d70d: '!2i!6VFBd_00200317!4e!6FBbt_00100354!1',
    d71d: '!2i!6VFBd_00200311!4e!6FBbt_00100349!1',
    d72d: '!2i!6VFBd_00200330!4e!6FBbt_00007077!1',
    d73d: '!2i!6VFBd_00200316!4e!6FBbt_00100341!1',
    d74d: '!2i!6VFBd_00200313!4e!6FBbt_00100356',
    e6: 'VFBi_a000000',
    e5: 'VFBi_a00000',
    e4: 'VFBi_a0000',
    e3: 'VFBi_a000',
    e2: 'VFBi_a00',
    e1: 'VFBi_a0',
    e0: 'VFBi_a',
    D8: 'VFBt_003!2S!20!2i!6VFBt_00300000!4N!6Larval Brain',
    D7: 'VFBi_0000000',
    D6: 'VFBi_000000',
    D5: 'VFBi_00000',
    D4: 'VFBi_0000',
    D3: 'VFBi_000',
    D2: 'VFBi_00',
    D1: 'VFBi_0',
    D0: 'VFBi_',
    E: '!4alpha!7220!9blend!6screen!4inverted!7false!8',
    e1e: '!4alpha!7100!9blend!6screen!4inverted!7false!8',
    e2e: '!4mod!6zeta!4slice!6',
    e3e: '!9blend!6screen!4inverted!7false!8',
    e4e: '!9blend!6multiply!4inverted!7true!8',
    e8e: '!4dst!7',
    e9e: '!4alpha!7',
    F8: '00000000',
    F7: '0000000',
    F6: '000000',
    F5: '00000',
    F4: '0000',
    F3: '000',
    g1g: '!2i!6VFBd_004!F5!4e!6FBbt_!F44052',
    g2g: '!2i!6VFBd_004!F41!4e!6FBbt_00110176',
    g3g: '!2i!6VFBd_004!F42!4e!6FBbt_00110175',
    g4g: '!2i!6VFBd_004!F43!4e!6FBbt_00110174',
    g5g: '!2i!6VFBd_004!F44!4e!6FBbt_!F44019',
    g6g: '!2i!6VFBd_004!F45!4e!6FBbt_00110173',
    g7g: '!2i!6VFBd_004!F46!4e!6FBbt_!F44099',
    g8g: '!2i!6VFBd_004!F47!4e!6FBbt_!F44108',
    g9g: '!2i!6VFBd_004!F48!4e!6FBbt_!F44107',
    g10g: '!2i!6VFBd_004!F49!4e!6FBbt_!F44106',
    g11g: '!2i!6VFBd_004!F310!4e!6FBbt_!F44096',
    g12g: '!2i!6VFBd_004!F311!4e!6FBbt_!F44095',
    g13g: '!2i!6VFBd_004!F312!4e!6FBbt_!F44063',
    g14g: '!2i!6VFBd_004!F313!4e!6FBbt_!F44060',
    g15g: '!2i!6VFBd_004!F314!4e!6FBbt_!F44055',
    g16g: '!2i!6VFBd_004!F315!4e!6FBbt_!F44056',
    g17g: '!2i!6VFBd_004!F316!4e!6FBbt_!F47657',
    g18g: '!2i!6VFBd_004!F317!4e!6FBbt_!F44061',
    g19g: '!2i!6VFBd_004!F318!4e!6FBbt_!F44062',
    g20g: '!2i!6VFBd_004!F319!4e!6FBbt_!F44094',
    g21g: '!2i!6VFBd_004!F320!4e!6FBbt_!F44091',
    g22g: '!2i!6VFBd_004!F323!4e!6FBbt_!F43625',
    g23g: '!2i!6VFBd_004!F324!4e!6FBbt_00125026',
    g24g: '!2i!6VFBd_004!F325!4e!6FBbt_00125027',
    g25g: '!2i!6VFBd_004!F326!4e!6FBbt_00125028',
    g26g: '!2i!6VFBd_004!F327!4e!6FBbt_00125029',
    g27g: '!2i!6VFBd_004!F328!4e!6FBbt_00125030',
    g28g: '!2i!6VFBd_004!F329!4e!6FBbt_!F44057',
    g29g: '!2i!6VFBd_004!F330!4e!6FBbt_00125004',
    g30g: '!2i!6VFBd_004!F340!4v!7false!9e!6FBbt_!F44020',
    g31g: '!2i!6VFBd_004!F341!4v!7false!9e!6FBbt_00125006',
    g32g: '!2i!6VFBd_004!F342!4v!7false!9e!6FBbt_00125013',
    g33g: '!2i!6VFBd_004!F343!4v!7false!9e!6FBbt_00125007',
    g34g: '!2i!6VFBd_004!F344!4v!7false!9e!6FBbt_00125008',
    g35g: '!2i!6VFBd_004!F345!4v!7false!9e!6FBbt_00125009',
    g36g: '!2i!6VFBd_004!F347!4v!7false!9e!6FBbt_00125024',
    g37g: '!2i!6VFBd_004!F348!4v!7false!9e!6FBbt_00125010',
    g38g: '!2i!6VFBd_004!F349!4v!7false!9e!6FBbt_00125011',
    g39g: '!2i!6VFBd_004!F350!4v!7false!9e!6FBbt_00125012',
    g40g: '!2i!6VFBd_004!F351!4v!7false!9e!6FBbt_00125014',
    g41g: '!2i!6VFBd_004!F352!4v!7false!9e!6FBbt_00125015',
    g42g: '!2i!6VFBd_004!F353!4v!7false!9e!6FBbt_00125016',
    g43g: '!2i!6VFBd_004!F354!4v!7false!9e!6FBbt_00125017',
    g44g: '!2i!6VFBd_004!F355!4v!7false!9e!6FBbt_00125019',
    g45g: '!2i!6VFBd_004!F356!4v!7false!9e!6FBbt_00125025',
    g46g: '!2i!6VFBd_004!F357!4v!7false!9e!6FBbt_00125018',
    g47g: '!2i!6VFBd_004!F358!4v!7false!9e!6FBbt_00125020',
    g48g: '!2i!6VFBd_004!F359!4v!7false!9e!6FBbt_!F43683',
    g49g: '!2i!6VFBd_004!F360!4v!7false!9e!6FBbt_00125021',
    g50g: '!2i!6VFBd_004!F361!4v!7false!9e!6FBbt_00125022',
    g51g: '!2i!6VFBd_00400100!4e!6FBgn0264975',
    g52g: '!2i!6VFBd_00400103!4v!7false!9e!6FBbt_00125033',
    g53g: '!2i!6VFBd_00400104!4e!6FBbt_00125034',
    g54g: '!2i!6VFBd_00400105!4e!6FBbt_00125035',
    g55g: '!2i!6VFBd_00400106!4e!6FBbt_00125036',
    g56g: '!2i!6VFBd_00400107!4e!6FBbt_00125037',
    g57g: '!2i!6VFBd_00400108!4e!6FBbt_00125038',
    g58g: '!2i!6VFBd_00400109!4e!6FBbt_00125039',
    g59g: '!2i!6VFBd_00400110!4e!6FBbt_00125040',
    g60g: '!2i!6VFBd_00400111!4e!6FBbt_00125041',
    g61g: '!2i!6VFBd_00400112!4e!6FBbt_00125042',
    g62g: '!2i!6VFBd_00400113!4v!7false!9e!6FBbt_00125043',
    g63g: '!2i!6VFBd_00400114!4e!6FBbt_00125044',
    g64g: '!2i!6VFBd_00400115!4e!6FBbt_00125045',
    g65g: '!2i!6VFBd_00400116!4e!6FBbt_00125046',
    g66g: '!2i!6VFBd_00400117!4e!6FBbt_00125047',
    g67g: '!2i!6VFBd_00400118!4e!6FBbt_00125048',
    g68g: '!2i!6VFBd_00400119!4v!7false!9e!6FBbt_00125049',
    g69g: '!2i!6VFBd_00400122!4e!6FBbt_00125050',
    g70g: '!2i!6VFBd_00400123!4e!6FBbt_00125051',
    g71g: '!2i!6VFBd_00400124!4e!6FBbt_00125052',
    g72g: '!2i!6VFBd_00400125!4e!6FBbt_00125053',
    g73g: '!2i!6VFBd_00400126!4e!6FBbt_00125054',
    g74g: '!2i!6VFBd_00400129!4e!6FBbt_00125055',
    g75g: '!2i!6VFBd_00400130!4e!6FBbt_00125056',
    g76g: '!2i!6VFBd_00400131!4v!7false!9e!6FBbt_00125057',
    g77g: '!2i!6VFBd_00400132!4e!6FBbt_00125058',
    g78g: '!2i!6VFBd_00400133!4e!6FBbt_00125059',
    g79g: '!2i!6VFBd_00400134!4v!7false!9e!6FBbt_00125060',
    g80g: '!2i!6VFBd_00400135!4e!6FBbt_00125061',
    g81g: '!2i!6VFBd_00400136!4v!7false!9e!6FBbt_00125062',
    g82g: '!2i!6VFBd_00400137!4e!6FBbt_00125063',
    g83g: '!2i!6VFBd_00400138!4v!7false!9e!6FBbt_00125064',
    g84g: '!2i!6VFBd_00400140!4e!6FBbt_00125065',
    g85g: '!2i!6VFBd_00400141!4e!6FBbt_00125066',
    g86g: '!2i!6VFBd_00400142!4e!6FBbt_00125067',
    g87g: '!2i!6VFBd_00400143!4e!6FBbt_00125068',
    g88g: '!2i!6VFBd_00400144!4e!6FBbt_00125069',
    g89g: '!2i!6VFBd_00400146!4e!6FBbt_00125070',
    g90g: '!2i!6VFBd_00400147!4e!6FBbt_00125071',
    g91g: '!2i!6VFBd_00400150!4e!6FBbt_00125072',
    g92g: '!2i!6VFBd_00400151!4e!6FBbt_00125073',
    g93g: '!2i!6VFBd_00400153!4e!6FBbt_00125074',
    g94g: '!2i!6VFBd_00400154!4e!6FBbt_00125075',
    g95g: '!2i!6VFBd_00400155!4e!6FBbt_00125076',
    g96g: '!2i!6VFBd_00400156!4e!6FBbt_00125077',
    g97g: '!2i!6VFBd_00400157!4e!6FBbt_00125078',
    g98g: '!2i!6VFBd_00400158!4e!6FBbt_00125079',
    g99g: '!2i!6VFBd_00400159!4e!6FBbt_00125080',
    g100g: '!2i!6VFBd_00400161!4e!6FBbt_00125081',
    g101g: '!2i!6VFBd_00400162!4e!6FBbt_00125082',
    g102g: '!2i!6VFBd_00400163!4v!7false!9e!6FBbt_00125083',
    g103g: '!2i!6VFBd_00400164!4e!6FBbt_00125084',
    g104g: '!2i!6VFBd_00400166!4e!6FBbt_00125085',
    g105g: '!2i!6VFBd_00400167!4e!6FBbt_00125086',
    g106g: '!2i!6VFBd_00400168!4e!6FBbt_00125087',
    g107g: '!2i!6VFBd_00400169!4e!6FBbt_00125088',
    g108g: '!2i!6VFBd_00400170!4e!6FBbt_00125089',
    g109g: '!2i!6VFBd_00400171!4e!6FBbt_00125090',
    g110g: '!2i!6VFBd_00400172!4e!6FBbt_00125091',
    g111g: '!2i!6VFBd_00400173!4v!7false!9e!6FBbt_00125092',
    g112g: '!2i!6VFBd_00400174!4e!6FBbt_00125093',
    g113g: '!2i!6VFBd_00400175!4e!6FBbt_00125094',
    g114g: '!2i!6VFBd_00400176!4e!6FBbt_00125095',
    g115g: '!2i!6VFBd_00400177!4v!7false!9e!6FBbt_00125096',
    g116g: '!2i!6VFBd_00400178!4e!6FBbt_00125097',
    g117g: '!2i!6VFBd_00400179!4e!6FBbt_00125098',
    g118g: '!2i!6VFBd_00400180!4e!6FBbt_00125099',
    g119g: '!2i!6VFBd_00400181!4e!6FBbt_00125100',
    g120g: '!2i!6VFBd_00400182!4e!6FBbt_00125101',
    g121g: '!2i!6VFBd_00400183!4v!7false!9e!6FBbt_00125102',
    g122g: '!2i!6VFBd_00400184!4e!6FBbt_00125103',
    g123g: '!2i!6VFBd_00400185!4e!6FBbt_00125104',
    g124g: '!2i!6VFBd_00400200!4v!7false!9e!6FBbt_00125105',
    g125g: '!2i!6VFBd_00400201!4v!7false!9e!6FBbt_00125106',
    g126g: '!2i!6VFBd_00400202!4v!7false!9e!6FBbt_00125107',
    g127g: '!2i!6VFBd_00400203!4v!7false!9e!6FBbt_00125108',
    g128g: '!2i!6VFBd_00400204!4v!7false!9e!6FBbt_00125109',
    g129g: '!2i!6VFBd_00400205!4v!7false!9e!6FBbt_00125110',
    g130g: '!2i!6VFBd_00400206!4v!7false!9e!6FBbt_00125111',
    g131g: '!2i!6VFBd_00400207!4v!7false!9e!6FBbt_00125112',
    g132g: '!2i!6VFBd_00400208!4v!7false!9e!6FBbt_00125113',
    g133g: '!2i!6VFBd_00400209!4v!7false!9e!6FBbt_00125114',
    g134g: '!2i!6VFBd_00400255!4e!6FBbt_!F44053!4I!6FBbt_!F42063',
    G: '"}}!8',
    H: 'VFBt_00',
    I8: '!2i!6!D8',
    I7: '!2i!6!D7',
    I6: '!2i!6!D6',
    I5: '!2i!6!D5',
    I4: '!2i!6!D4',
    I3: '!2i!6!D3',
    I2: '!2i!6!D2',
    I1: '!2i!6!D1',
    J1: '!2i!6VFBd_00100',
    J2: '!2i!6VFBd_00200',
    J3: '!2i!6VFBd_00300',
    J4: '!2i!6VFBd_00400',
    J5: '!2i!6VFBd_00500',
    j1: '!2i!6VFBd_001',
    j2: '!2i!6VFBd_002',
    j3: '!2i!6VFBd_003',
    j4: '!2i!6VFBd_004',
    j5: '!2i!6VFBd_005',
    K6: '!6FBbt_000000',
    K5: '!6FBbt_00000',
    K4: '!6FBbt_0000',
    K3: '!6FBbt_000',
    K2: '!6FBbt_00',
    K1: '!6FBbt_0',
    L3: '!4I!6FBbt_!F45106!',
    L2: '!4I!6FBbt_!F34!F37!',
    L1: '!4I!6FBbt_!F',
    L0: '!6FBbt_!F',
    M1: '!9pit!70!9yaw!70!9rol!70!9qlt!780!9cvt!6png!4fxp!6',
    M2: '!9pit!790!9yaw!790!9rol!790!9qlt!780!9cvt!6png!4fxp!6',
    M3: '!9pit!790!9yaw!70!9rol!790!9qlt!780!9cvt!6png!4fxp!6',
    M4: '!9mod!6zeta!4slice',
    M5: '!3C!2T!6!H1!4scl!',
    M6: '!3C!2T!6!H2!4scl!',
    M7: '!3C!2T!6!H3!4scl!',
    M8: '!3C!2T!6!H4!4scl!',
    M9: '!3C!2T!6!H5!4scl!',
    N1: '!c1c2!c2c3!c3c4!c4c5!c5c6!c6c7!c7c8!c8c9!c9c10!c10c11!c11c12!c12c13!c13c14!c14c15!c15c16!c16c17!c17c18!c18c19!c19c20!c20c21!c21c22!c22c23!c23c24!c24c25!c25c26!c26c27!c27c28!c28c29!c29c30!c30c31!c31c32',
    N2: '!d1d2!d2d3!d3d4!d4d5!d5d6!d6d7!d7d8!d8d9!d9d10!d10d11!d11d12!d12d13!d13d14!d14d15!d15d16!d16d17!d17d18!d18d19!d19d20!d20d21!d21d22!d22d23!d23d24!d24d25!d25d26!d26d27!d27d28!d28d29!d29d30!d30d31!d31d32!d32d33!d33d34!d34d35!d35d36!d36d37!d37d38!d38d39!d39d40!d40d41!d41d42!d42d43!d43d44!d44d45!d45d46!d46d47!d47d48!d48d49!d49d50!d50d51!d51d52!d52d53!d53d54!d54d55!d55d56!d56d57!d57d58!d58d59!d59d60!d60d61!d61d62!d62d63!d63d64!d64d65!d65d66!d66d67!d67d68!d68d69!d69d70!d70d71!d71d72!d72d73!d73d74!d74d',
    N4: '!g1g!12!g2g!13!g3g!14!g4g!15!g5g!16!g6g!17!g7g!18!g8g!19!g9g!110!g10g!111!g11g!112!g12g!113!g13g!114!g14g!115!g15g!116!g16g!117!g17g!118!g18g!119!g19g!120!g20g!121!g21g!122!g22g!123!g23g!124!g24g!125!g25g!126!g26g!127!g27g!128!g28g!129!g29g!130!j4!F340!4e!L044020!131!j4!F341!4e!K2125006!132!j4!F342!4e!K2125013!133!j4!F343!4e!K2125007!134!j4!F344!4e!K2125008!135!j4!F345!4e!K2125009!136!j4!F347!4e!K2125024!137!j4!F348!4e!K2125010!138!j4!F349!4e!K2125011!139!j4!F350!4e!K2125012!140!j4!F351!4e!K2125014!141!j4!F352!4e!K2125015!142!j4!F353!4e!K2125016!143!j4!F354!4e!K2125017!144!j4!F355!4e!K2125019!145!j4!F356!4e!K2125025!146!j4!F357!4e!K2125018!147!j4!F358!4e!K2125020!148!j4!F359!4e!L043683!149!j4!F360!4e!K2125021!150!j4!F361!4e!K2125022!151!g51g!152!J4103!4e!K2125033!153!g53g!154!g54g!155!g55g!156!g56g!157!g57g!158!g58g!159!g59g!160!g60g!161!g61g!162!J4113!4e!K2125043!163!g63g!164!g64g!165!g65g!166!g66g!167!g67g!168!J4119!4e!K2125049!169!g69g!170!g70g!171!g71g!172!g72g!173!g73g!174!g74g!175!g75g!176!J4131!4e!K2125057!177!g77g!178!g78g!179!J4134!4e!K2125060!180!g80g!181!J4136!4e!K2125062!182!g82g!183!J4138!4e!K2125064!184!g84g!185!g85g!186!g86g!187!g87g!188!g88g!189!g89g!190!g90g!191!g91g!192!g92g!193!g93g!194!g94g!195!g95g!196!g96g!197!g97g!198!g98g!199!g99g!1100!g100g!1101!g101g!1102!J4163!4e!K2125083!1103!g103g!1104!g104g!1105!g105g!1106!g106g!1107!g107g!1108!g108g!1109!g109g!1110!g110g!1111!J4173!4e!K2125092!1112!g112g!1113!g113g!1114!g114g!1115!J4177!4e!K2125096!1116!g116g!1117!g117g!1118!g118g!1119!g119g!1120!g120g!1121!J4183!4e!K2125102!1122!g122g!1123!g123g',
    N5: 'XXXXXXXXXX',
    O1: '!6<span id=\\"partParent\\"><li>neuron</li></span>!',
    O3: '!6<span id=\\"partParent\\"><li>adult fruitless ',
    O4: ' (male) neuron</li></span>!',
    O5: ' (female) neuron</li></span>!',
    O6: '!6<span id=\\"partParent\\"><li>adult ',
    O7: ' lineage clone</li></span>!',
    O8: '!6<span id=\\"partParent\\"><li>',
    O9: '</li></span>',
    o1: '!6fru-F-',
    o2: '!6fru-M-',
    o3: ' clone of ',
    o4: 'VGlut-F-',
    o5: 'VGlut-M-',
    o9: ' 201',
    P1: '!4v!7false!8',
    P2: '!2i!6!D0a!F',
    P3: '!H4!2S!20!2i!6!H4!F5',
    P4: '!2i!6!e4',
    P5: '!2i!6!e3',
    P6: '!2i!6!e2',
    P7: '!2i!6!e',
    P8: 'false',
    P9: 'true'
};
var availableTemplates = ['VFBt_001','VFBt_002','VFBt_003','VFBt_004']; // TBD generate from folders


function updateStackCounter() {
    try {
        var html;
        if (parent.$("body").data("meta")) {
            $("[id=stackName]").each(function () {
                $(this).text(parent.$("body").data("meta").name);
            });
        }
        if (store.enabled) {
            var data = store.get('data');
            if (data !== undefined && data.current !== undefined) {
                var count = Object.keys(data[data.current.template].selected).length - 1;
                $("[id=viewer2DVal]").each(function () {
                    $(this).text(count);
                });
                var tIcount = totalItemCount();
                $("#viewerTotalItems").text(tIcount);

                if (window.location.pathname != "/site/stacks/index.htm") {
                    $("#openStackViewerOption").show();
                } else {
                    $("#openStackViewerOption").hide();
                }
                if (0 < parseInt(count)) {
                    $("#clearAllOption").show();
                } else {
                    $("#clearAllOption").hide();
                }
                if (tIcount > parseInt(count)) {
                    $("#clearEverythingOption").show();
                } else {
                    $("#clearEverythingOption").hide();
                }
                try {
                    var i;
                    for (i in parent.$('body').data()) if (i.indexOf('VFB') > -1) {
                        if (location.hostname.toLowerCase().indexOf('sandbox') > -1 || (parent.$('body').data(i).hasOwnProperty('meta') && parent.$('body').data(i).meta.hasOwnProperty('isLive') && parent.$('body').data(i).meta.isLive)) {
                            $("#open" + i).show();
                        } else {
                            $("#open" + i).hide();
                        }
                    }
                } catch (ignore) {
                    if (typeof i !== 'undefined') {
                        console.log('Loading meta data for ' + i);
                        backgroundLoadMeta();
                    } else {
                        console.log('Issue accessing metadata...');
                    }
                }
                try {
                    if (parent.$('body').data('current') && parent.$('body').data(parent.$('body').data('current').template).meta.has3D || location.hostname.toLowerCase().indexOf('sandbox') > -1) {
                        $("#menuOpen3Dlink").show();
                    } else {
                        $("#menuOpen3Dlink").hide();
                    }
                } catch (ignore) {
                    if (parent.$('body').data('current') && parent.$('body').data('current').template) {
                        console.log('Missing 3D meta data for ' + parent.$('body').data('current').template);
                        backgroundLoadMeta();
                    } else {
                        console.log('Awaiting initialisation...');
                    }
                }
                $("#menuOpen3Dlink").attr("href", "http://129.215.164.244:8084/org.geppetto.frontend/geppetto?load_project_from_url=" + returnGeppettoConfUrl());
                $("[id^=Count]").each(function () {
                    try {
                        $(this).text(Object.keys(data[$(this).attr('id').replace("CountVFBt", "VFBt")].selected).length - 1);
                        if ($(this).attr('id').replace("CountVFBt", "VFBt") == data.current.template) {
                            $(this).removeClass('label-warning').addClass('label-success');
                        } else {
                            $(this).addClass('label-warning').removeClass('label-success');
                        }
                    } catch (ignore) {
                    }
                });
                generateAddButtons();

                if (store.get('cookie-box') != 'c') {
                    $('#cookie-warning').show();
                    html = '<div class="col-md-8 col-md-offset-2">';
                    html += '<div class="alert alert-info" role="alert" id="info-char">';
                    html += '<button type="button" class="close" data-dismiss="alert" aria-label="Close" onclick="';
                    html += "store.set('cookie-box', 'c');";
                    html += '"><span aria-hidden="true">&times;</span></button>';
                    html += '<center>';
                    html += '<strong><span class="glyphicon glyphicon-info-sign"></span></strong> Just so you know this site uses cookies to track usage and browser local data storage to store your preferences. <br>';
                    html += 'By continuing to use our website, you agree to the use of local data storage and cookies. <br>';
                    html += 'If you would like to know more about cookies and how to manage them please view our <a href="/site/vfb_site/privacy_cookies.htm">privacy and cookies</a> policy.';
                    html += '</center>';
                    html += '</div>';
                    html += '</div>';
                    $('#cookie-warning').html(html);
                } else {
                    $('#cookie-warning').hide();
                }
                if (store.get('dev-box') != 'c') {
                    $('#dev-warning').show();
                    $.removeCookie('#dev-warning', {path: '/'});
                    html = '<div class="col-md-8 col-md-offset-2">';
                    html += '<div class="alert alert-warning" role="alert" id="warning-char">';
                    html += '<button type="button" class="close" data-dismiss="alert" aria-label="Close" onclick="';
                    html += "store.set('dev-box', 'c');";
                    html += '"><span aria-hidden="true">&times;</span></button>';
                    html += '<center>';
                    html += '<strong><span class="glyphicon glyphicon-warning-sign"></span></strong> This is a test server and not the official VFB site.';
                    html += '</center>';
                    html += '</div>';
                    html += '</div>';
                    $('#dev-warning').html(html);
                } else {
                    $('#dev-warning').hide();
                }
            }
        } else {
            if ($.cookie("displaying")) {
                var stack = expandCookieDisplayed();
                if (stack.current) {
                    $("[id=viewer2DVal]").each(function () {
                        if (stack[stack.current.template]) {
                            $(this).text(Object.keys(stack[stack.current.template].selected).length - 1);
                            if (typeof $.fn.dataTable !== 'undefined' && $.fn.dataTable.isDataTable('#displayed') && parseInt(Object.keys(stack[stack.current.template].selected).length - 1) !== (parseInt($('#displayed').dataTable().fnSettings().fnRecordsTotal()) - 1)) {
                                if (checkCount + 10000 < performance.now()) {
                                    $(this).text(String(Object.keys(stack[stack.current.template].selected).length - 1) + "/" + String(parseInt($('#displayed').dataTable().fnSettings().fnRecordsTotal()) - 1));
                                    alertMessage('Only ' + String(Object.keys(stack[stack.current.template].selected).length - 1) + ' out of ' + String(parseInt($('#displayed').dataTable().fnSettings().fnRecordsTotal()) - 1) + ' were saved!');
                                    $(this).removeClass('label-success').addClass('label-danger');
                                    $(this).attr('title', 'Too many items selected to save! Note: you can still work but new items will not be saved; you can try clearing items in other templates to free space.');
                                } else {
                                    $(this).text(String(Object.keys(stack[stack.current.template].selected).length - 1) + "/" + String(parseInt($('#displayed').dataTable().fnSettings().fnRecordsTotal()) - 1));
                                }
                            } else {
                                checkCount = performance.now();
                                $(this).addClass('label-success').removeClass('label-danger');
                                $(this).attr('title', 'Number of items currently saved');
                            }
                        } else {
                            parent.$("body").data(stack.current.template, {
                                selected: {
                                    0: {
                                        id: stack.current.template + "00000",
                                        colour: "auto",
                                        visible: true
                                    }
                                }
                            });
                            updateStackData();
                        }
                    });
                    if (window.location.pathname != "/site/stacks/index.htm") {
                        $("#openStackViewerOption").show();
                    } else {
                        $("#openStackViewerOption").hide();
                    }
                    if (0 < parseInt(Object.keys(stack[stack.current.template].selected).length - 1)) {
                        $("#clearAllOption").show();
                    } else {
                        $("#clearAllOption").hide();
                    }
                    if (totalItemCount() > (Object.keys(stack[stack.current.template].selected).length - 1)) {
                        $("#clearEverythingOption").show();
                    } else {
                        $("#clearEverythingOption").hide();
                    }
                    $("#viewerTotalItems").text(totalItemCount());
                    $("[id^=Count]").each(function () {
                        if (stack[$(this).attr('id').replace("CountVFBt", "VFBt")] && Object.keys(stack[$(this).attr('id').replace("CountVFBt", "VFBt")].selected).length - 1 > 0) {
                            $(this).text(Object.keys(stack[$(this).attr('id').replace("CountVFBt", "VFBt")].selected).length - 1);
                            $(this).show();
                            if ($(this).attr('id').replace("CountVFBt", "VFBt") == stack.current.template) {
                                $(this).removeClass('label-warning').addClass('label-success');
                            } else {
                                $(this).addClass('label-warning').removeClass('label-success');
                            }
                        } else {
                            if ($(this).attr('id').replace("CountVFBt", "VFBt") == stack.current.template) {
                                $(this).text('0');
                                $(this).removeClass('label-warning').addClass('label-success');
                                $(this).show();
                            } else {
                                $(this).text('-');
                                $(this).addClass('label-warning').removeClass('label-success');
                                $(this).hide();
                            }
                        }
                    });
                    generateAddButtons();

                    if ($.cookie('cookie-box') != 'c') {
                        $.removeCookie('cookie-box', {path: '/'});
                        $('#cookie-warning').show();
                        html = '<div class="col-md-8 col-md-offset-2">';
                        html += '<div class="alert alert-info" role="alert" id="info-char">';
                        html += '<button type="button" class="close" data-dismiss="alert" aria-label="Close" onclick="';
                        html += "$.cookie('cookie-box', 'c', { expires: 5*365, path: '/' });";
                        html += '"><span aria-hidden="true" >&times;</span></button>';
                        html += '<center>';
                        html += '<strong><span class="glyphicon glyphicon-info-sign"></span></strong> Just so you know this site uses cookies to track usage and preferences. <br>';
                        html += 'By continuing to use our website, you agree to the use of cookies. <br>';
                        html += 'If you would like to know more about cookies and how to manage them please view our <a href="/site/vfb_site/privacy_cookies.htm">privacy and cookies</a> policy.';
                        html += '</center>';
                        html += '</div>';
                        html += '</div>';
                        $('#cookie-warning').html(html);
                        $.removeCookie('cookie-box', {path: '/'});
                    } else {
                        $('#cookie-warning').hide();
                    }
                    if ($.cookie('dev-box') != 'c') {
                        $('#dev-warning').show();
                        $.removeCookie('#dev-warning', {path: '/'});
                        html = '<div class="col-md-8 col-md-offset-2">';
                        html += '<div class="alert alert-warning" role="alert" id="warning-char">';
                        html += '<button type="button" class="close" data-dismiss="alert" aria-label="Close" onclick="';
                        html += "$.cookie('dev-box', 'c', { expires: 7, path: '/' });";
                        html += '"><span aria-hidden="true">&times;</span></button>';
                        html += '<center>';
                        html += '<strong><span class="glyphicon glyphicon-warning-sign"></span></strong> This is a test server and not the official VFB site.';
                        html += '</center>';
                        html += '</div>';
                        html += '</div>';
                        $('#dev-warning').html(html);
                        $.removeCookie('dev-box', {path: '/'});
                    } else {
                        $('#dev-warning').hide();
                    }

                }
            }
        }
    } catch (err) {
        console.log('Reloading due to error...');
        console.log(err.message);
        window.open(window.location.href, '_top');
    }
}

function cleanIdforExt(id) {
    if (id) {
        id = id.replace(":", "_");
        id = id.toLowerCase().replace("vfb", "VFB").replace('fb', 'FB');
        id = id.replace('VFBi_', 'VFB_');
        if (id.indexOf('fbbt') > -1) {
            id = id.substr(0, id.indexOf('fbbt'));
        }
        return id;
    }
    return "";
}

function cleanIdforInt(id) {
    if (id) {
        id = id.replace(":", "_");
        id = id.toLowerCase().replace("vfb", "VFB").replace('fb', 'FB');
        id = id.replace('VFB_', 'VFBi_');
        if (id.indexOf('fbbt') > -1) {
            id = id.substr(0, id.indexOf('fbbt'));
        }
        return id;
    }
    return "";
}

function backgroundLoadMeta(id) {
    try {
        if (id && id.indexOf('VFBt_')>-1) {
            var file = "/data/" + fileFromId(id).replace("composite.wlz", "meta.json");
            $.getJSON(file, function (data) {
                $.each(data, function (key, val) {
                    parent.$("body").data(id)[key] = val;
                });
            });
        } else {
            var i;
            for (i in availableTemplates){
                backgroundLoadMeta(availableTemplates[i]);
            }
        }
    }catch (ignore){
        console.log('Background meta loading error...');
    }
}

function loadTemplateMeta(id) {
    if (id) {
        if (parent.$("body").data(id.substr(0, 8)) && parent.$("body").data(id.substr(0, 8)).meta && parent.$("body").data(id.substr(0, 8)).meta.template && parent.$("body").data(id.substr(0, 8)).meta.template == id.substr(0, 8) && parent.$("body").data(id.substr(0, 8)).meta.loaded > Date.now() - (24 * 60 * 60000)) {
            parent.$("body").data('meta', JSON.parse(JSON.stringify(parent.$("body").data(id.substr(0, 8)).meta)));
            parent.$("body").data('current', JSON.parse(JSON.stringify(parent.$("body").data(id.substr(0, 8)).current)));
            parent.$("body").data('domains', JSON.parse(JSON.stringify(parent.$("body").data(id.substr(0, 8)).domains)));
            parent.$("body").data('available', JSON.parse(JSON.stringify(parent.$("body").data(id.substr(0, 8)).available)));
            parent.$("body").data(id.substr(0, 8)).selected[0].name = parent.$("body").data('meta').name + ' Template';
            parent.$("body").data(id.substr(0, 8)).selected[0].type = $('#backgroundStain').html();
            if (parent.$("body").data("current") === undefined || parent.$("body").data("current").fxp == "0.0,0.0,0.0" || parent.$("body").data("current").fxp == "0,0,0" || parent.$("body").data("current").fxp == "undefined") {
                parent.$("body").data("current").fxp = parent.$("body").data("meta").center;
                var temp = parent.$("body").data("meta").center.split(',');
                window.selPointX = temp[0];
                window.selPointY = temp[1];
                window.selPointZ = temp[2];
            }
        } else {
            var file = "/data/" + fileFromId(id).replace("composite.wlz", "meta.json");
            $.getJSON(file, function (data) {
                $.each(data, function (key, val) {
                    parent.$("body").data(key, val);
                });
                parent.$("body").data("current").fxp = parent.$("body").data("meta").center;
                var temp = parent.$("body").data("meta").center.split(',');
                window.selPointX = temp[0];
                window.selPointY = temp[1];
                window.selPointZ = temp[2];
                var l;
                var list = "";
                for (l in $('body').data("domains")) {
                    if (!$('body').data("domains")[l].extId || !$('body').data("domains")[l].extId[0] || $('body').data("domains")[l].extId[0] === "") {
                        $('body').data("domains")[l].extId = ["TBA_" + pad(l, 8)];
                    }
                    if ($('body').data("domains")[l].id > "") {
                        list += cleanIdforInt($('body').data("domains")[l].extId[0]) + ",";
                    }
                }
                parent.$("body").data("available", list);
                updateStackData();
                parent.$("body").data(id.substr(0, 8)).current = JSON.parse(JSON.stringify(parent.$("body").data("current")));
                parent.$("body").data("meta").template = id.substr(0, 8);
                parent.$("body").data("meta").loaded = Date.now();
                parent.$("body").data(id.substr(0, 8)).meta = JSON.parse(JSON.stringify(parent.$("body").data("meta")));
                parent.$("body").data(id.substr(0, 8)).domains = JSON.parse(JSON.stringify(parent.$("body").data("domains")));
                parent.$("body").data(id.substr(0, 8)).available = JSON.parse(JSON.stringify(parent.$("body").data("available")));
            });
        }
    }
    if (typeof(parent.$("body").data("meta")) != "undefined") {
        var orientation = {Z: {W: 0, H: 1, D: 2}, Y: {W: 0, H: 2, D: 1}, X: {W: 1, H: 2, D: 0}};
        var orient = parent.$("body").data("current").slice;
        parent.$("body").data("current").scl = String(Math.round((($('#viewer-panel').width() - 50) / (parent.$("body").data("meta").extent.split(',')[orientation[orient].W] * parent.$("body").data("meta").voxel.split(',')[orientation[orient].W])) * 10) / 10);
    }
}

function jump(h) {
    try {
        if (document.getElementById(h) !== null && (typeof $('#AnatoMenuTab').attr('active') == "undefined" || $('#AnatoMenuTab').attr('class') != "active")) {
            var top = document.getElementById(h).offsetTop;
            var left = document.getElementById(h).offsetLeft;
            window.scrollTo(left, top);
        }
    } catch (ignore) {
    }
}

function createColButHTML(i) {
    var content = "";
    if (layer && parent.$("body").data("colours")) {
        var temp;
        if (layer.colour == "auto") {
            while (i > 200)i = i - 200;
            temp = parent.$("body").data("colours")[i];
        } else {
            temp = layer.colour;
        }
        content += '<button type="button" data-index="' + String(i) + '" data-status="created" class="btn btn-default btn-xs" aria-label="Adjust Colour" title="Adjust Colour" ';
        content += 'style="background:rgb(' + temp + ');"><span style="border:none;padding-left:0;padding-right:0;" class="glyphicon glyphicon-tint"></span></button>';
    }
    return content;
}

function createAddButtonHTMLfinal(id) {
    id = cleanIdforInt(id);
    var content = "";
    var selected = parent.$("body").data(parent.$("body").data("current").template).selected;
    if (JSON.stringify(selected).indexOf(id) > -1) {
        content += '<button type="button" class="btn btn-success btn-xs" aria-label="Remove from stack viewer" title="Currently added to stack viewer; click to remove" onclick="';
        content += "removeFromStackData('" + id + "');updateStackData();if (typeof updateMenuData !== 'undefined' && $.isFunction(updateMenuData)) {updateMenuData();};if (typeof updateWlzDisplay !== 'undefined' && $.isFunction(updateWlzDisplay)) {updateWlzDisplay();};";
        content += '"><span style="border:none;" class="glyphicon glyphicon-ok-circle"></span></button>';
        var i;
        for (i in selected) {
            if (JSON.stringify(selected[i]).indexOf(id) > -1) {
                content += createColButHTML(i);
                break;
            }
        }
    } else {
        content += '<button type="button" class="btn btn-success btn-xs" aria-label="Add to stack viewer" title="Add to stack viewer" onclick="';
        content += "addToStackData('" + id + "');updateStackData();if (typeof updateMenuData !== 'undefined' && $.isFunction(updateMenuData)) {updateMenuData();};if (typeof updateWlzDisplay !== 'undefined' && $.isFunction(updateWlzDisplay)) {updateWlzDisplay();};";
        content += '"><span style="border:none;" class="glyphicon glyphicon-paperclip"></span></button>';
    }
    return content;
}

function generateAddButtons() {
    if (parent.$("body").data("available")) {
        $("[id^=imageViewerOpen]").each(function () {
            var html = '<button class="btn btn-sm btn-success" onclick="';
            html += "post('/site/stacks/index.htm',{'add':'" + cleanIdforInt($(this).data('id')) + "'});";
            if (($('body').data("available") && $('body').data("available").indexOf(cleanIdforInt($(this).data('id'))) > -1) || cleanIdforInt($(this).data('id')).indexOf('VFB') > -1) {
                html += '" title="Open ' + $(this).data('name') + ' in stack viewer">Open ' + $(this).data('name') + ' in stack viewer</button>';
                $(this).html(html);
                $(this).attr('id', 'ResolvedImageViewerOpen');
            } else {
                html += '" title="Open ' + $(this).data('name') + ' in stack viewer" disabled="disabled">' + $(this).data('name') + ' is not specifically labeled in the current stack</button>';
                html = html.replace('btn-success', 'btn-default');
                $(this).html(html);
                $(this).attr('id', 'ResolvedImageViewerOpen');
            }
        });
        $("[id^=attach]").each(function () {
            var id = cleanIdforInt($(this).data("id"));
            var content = "";
            if ($(this).html() === "") {
                if (id.indexOf("FBbt_") > -1) {
                    if (parent.$("body").data("available").indexOf(id) > -1) {
                        if (JSON.stringify(parent.$("body").data(parent.$("body").data("current").template).selected).indexOf(id) > -1) {
                            content += '<button type="button" class="btn btn-success btn-xs" aria-label="Remove from stack viewer" title="Currently added to stack viewer; click to remove" onclick="';
                            content += "removeFromStackData('" + id + "');$('*[id=attach][data-id=" + cleanIdforExt($(this).data("id")) + "]').html('');updateStackData();if (typeof updateMenuData !== 'undefined' && $.isFunction(updateMenuData)) {updateMenuData();};if (typeof updateWlzDisplay !== 'undefined' && $.isFunction(updateWlzDisplay)) {updateWlzDisplay();};";
                            content += '"><span style="border:none;" class="glyphicon glyphicon-ok-circle"></span></button>';
                            $(this).html(content);
                        } else {
                            content += '<button type="button" class="btn btn-success btn-xs" aria-label="Add to stack viewer" title="Add to stack viewer" onclick="';
                            content += "addToStackData('" + id + "',false);$('*[id=attach][data-id=" + cleanIdforExt($(this).data("id")) + "]').html('');updateStackData();if (typeof updateMenuData !== 'undefined' && $.isFunction(updateMenuData)) {updateMenuData();};if (typeof updateWlzDisplay !== 'undefined' && $.isFunction(updateWlzDisplay)) {updateWlzDisplay();};";
                            content += '"><span style="border:none;" class="glyphicon glyphicon-paperclip"></span></button>';
                        }
                    }
                } else if (id.indexOf("VFB") > -1) {
                    if (JSON.stringify(parent.$("body").data(parent.$("body").data("current").template).selected).indexOf(id) > -1) {
                        content += '<button type="button" class="btn btn-success btn-xs" aria-label="Remove from stack viewer" title="Currently added to stack viewer; click to remove" onclick="';
                        content += "removeFromStackData('" + id + "');$('*[id=attach][data-id=" + cleanIdforExt($(this).data("id")) + "]').html('');updateStackData();if (typeof updateMenuData !== 'undefined' && $.isFunction(updateMenuData)) {updateMenuData();};if (typeof updateWlzDisplay !== 'undefined' && $.isFunction(updateWlzDisplay)) {updateWlzDisplay();};";
                        content += '"><span style="border:none;" class="glyphicon glyphicon-ok-circle"></span></button>';
                        $(this).html(content);
                    } else {
                        content += '<button type="button" class="btn btn-success btn-xs" aria-label="Add to stack viewer" title="Add to stack viewer" onclick="';
                        // TBD Need to resolve correct template:
                        content += "addToStackData(['VFBt_00100000','" + id + "'],false);$('*[id=attach][data-id=" + cleanIdforExt($(this).data("id")) + "]').html('');updateStackData();if (typeof updateMenuData !== 'undefined' && $.isFunction(updateMenuData)) {updateMenuData();};if (typeof updateWlzDisplay !== 'undefined' && $.isFunction(updateWlzDisplay)) {updateWlzDisplay();};";
                        content += '"><span style="border:none;" class="glyphicon glyphicon-paperclip"></span></button>';
                    }
                } else if (id.indexOf("FBgn") > -1) {
                    if (parent.$("body").data("available").indexOf(id) > -1) {
                        if (JSON.stringify(parent.$("body").data(parent.$("body").data("current").template).selected).indexOf(id) > -1) {
                            content += '<button type="button" class="btn btn-success btn-xs" aria-label="Remove from stack viewer" title="Currently added to stack viewer; click to remove" onclick="';
                            content += "removeFromStackData('" + id + "');$('*[id=attach][data-id=" + cleanIdforExt($(this).data("id")) + "]').html('');updateStackData();if (typeof updateMenuData !== 'undefined' && $.isFunction(updateMenuData)) {updateMenuData();};if (typeof updateWlzDisplay !== 'undefined' && $.isFunction(updateWlzDisplay)) {updateWlzDisplay();};";
                            content += '"><span style="border:none;" class="glyphicon glyphicon-ok-circle"></span></button>';
                            $(this).html(content);
                        } else {
                            content += '<button type="button" class="btn btn-success btn-xs" aria-label="Add to stack viewer" title="Add to stack viewer" onclick="';
                            content += "addToStackData('" + id + "',false);$('*[id=attach][data-id=" + cleanIdforExt($(this).data("id")) + "]').html('');updateStackData();if (typeof updateMenuData !== 'undefined' && $.isFunction(updateMenuData)) {updateMenuData();};if (typeof updateWlzDisplay !== 'undefined' && $.isFunction(updateWlzDisplay)) {updateWlzDisplay();};";
                            content += '"><span style="border:none;" class="glyphicon glyphicon-paperclip"></span></button>';
                        }
                    }
                }
                $(this).html(content);
            }
        });
        if (window.location.pathname == "/site/stacks/index.htm") {
            $("[id^=addToQuery]").each(function () {
                if ($(this).data("id") && $(this).data("id") !== "undefined") {
                    var text = '<a href="#" class="btn btn-xs btn-info" onclick="';
                    text += "parent.$('#query_builder').attr('src', '/do/query_builder.html?action=add&amp;rel=include&amp;fbId=" + cleanIdforExt($(this).data("id")) + "');if (typeof openQueryTab !== 'undefined' && $.isFunction(openQueryTab)) {openQueryTab();};try{ga('send', 'event', 'query', 'add', '" + cleanIdforExt($(this).data("id")) + "');} catch (ignore) {}";
                    text += '"><span style="border:none;" class="glyphicon glyphicon-tasks"></span></a>';
                    $(this).html(text);
                    $(this).attr("id", "Resolved" + $(this).attr("id"));
                } else {
                    $(this).attr("id", "NA" + $(this).attr("id"));
                }
            });
        }
    } else {
        if ($('body').data("domains") && $('body').data("current") && $('body').data($('body').data("current").template).selected) {
            var selected = $('body').data($('body').data("current").template).selected;
            var domains = $('body').data("domains");
            var available = selected[0].id;
            var i;
            for (i in domains) {
                if (domains[i].domainData.domainId && domains[i].domainData.domainId !== "") {
                    if (domains[i].extId && domains[i].extId[0] && domains[i].extId[0] !== "undefined" && domains[i].extId[0] !== "") {
                        available += ',' + cleanIdforInt(domains[i].extId[0]);
                    }
                }
            }
            parent.$("body").data("available", available);
        }
    }
}

function fileFromId(id) {
    var file = "";
    if (id) {
        id = cleanIdforInt(id);
        if (id.indexOf("VFBt_") > -1) {
            file = id.replace("00000", "").replace("VFBt_", "VFB/t/") + "/composite.wlz";
        } else if (id.indexOf("VFBi_") > -1) {
            file = "VFB/i/" + id.substr(5, 4) + "/" + id.substr(9, 4) + "/volume.wlz";
        } else if (id.indexOf("VFB_") > -1) {
            file = "VFB/i/" + id.substr(4, 4) + "/" + id.substr(8, 4) + "/volume.wlz";
        } else if (id.indexOf("VFBd_") > -1) {
            file = id.substr(0, 8).replace("VFBd_", "VFB/t/") + "domain" + id.substr(8) + ".wlz";
        }
    }
    return file;
}

function rgbColToHex(rgb) {
    var hex = "#";
    var s = 0;
    var e = rgb.length;
    if (rgb.indexOf('(') > -1) {
        s = rgb.indexOf('(') + 1;
        e = rgb.indexOf(')');
    }
    var col = rgb.substr(s, e - s).split(',');
    for (s in col) {
        hex += pad(parseInt(col[s]).toString(16), 2);
    }
    return hex;
}

function hexColToRGB(hex) {
    var rgb = "";
    hex = hex.replace('#', '');
    rgb += String(parseInt(hex.substr(0, 2), 16)) + ',';
    rgb += String(parseInt(hex.substr(2, 2), 16)) + ',';
    rgb += String(parseInt(hex.substr(4, 2), 16));
    return rgb;
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function updateStackData() {
    if (store.enabled) {
        if (parent.$("body").data("meta") && parent.$("body").data("meta").template && parent.$("body").data("meta").template == parent.$("body").data("current").template) {
            parent.$("body").data(parent.$("body").data('current').template).current = JSON.parse(JSON.stringify(parent.$("body").data("current")));
            parent.$("body").data(parent.$("body").data('current').template).meta = JSON.parse(JSON.stringify(parent.$("body").data("meta")));
            parent.$("body").data(parent.$("body").data('current').template).domains = JSON.parse(JSON.stringify(parent.$("body").data("domains")));
            parent.$("body").data(parent.$("body").data('current').template).available = JSON.parse(JSON.stringify(parent.$("body").data("available")));
        } else {
            if (parent.$("body").data('current') && parent.$("body").data('current').template) {
                loadTemplateMeta(parent.$("body").data('current').template);
            }
        }
        if (parent.$("body").data() && JSON.stringify(parent.$("body").data()).length > 10) {
            if (store.has('updated')) {
                if (store.get('updated').session == window.id) {
                    store.set('data', JSON.parse(JSON.stringify(parent.$("body").data())));
                } else {
                    if (store.get('updated').time > Date.now() - 10 * 60000) {
                        var oldScl = parent.$("body").data("current").scl;
                        var oldDst = parent.$("body").data("current").dst;
                        var oldTemp = parent.$("body").data("current").template;
                        parent.$("body").data(expandCookieDisplayed());
                        console.log('overridden by another session');
                        if (location.pathname == "/site/stacks/index.htm") {
                            if (parent.$("body").data("current").template == oldTemp) {
                                parent.$("body").data("current").scl = oldScl;
                                parent.$("body").data("current").dst = oldDst;
                            } else {
                                parent.$('body').data('disp', 'scale');
                            }
                            if (vis()) {
                                forceStoreControl();
                                store.set('data', JSON.parse(JSON.stringify(parent.$("body").data())));
                                parent.$('body').data('disp', 'scale');
                            } else {
                                if (document.title.indexOf('*') < 0) {
                                    document.title = "*" + document.title;
                                }
                            }
                        }
                        //try {history.pushState( {}, parent.$("body").data("meta").name, location.pathname );}catch (ignore){}
                        window.reloadInterval = 10;
                    } else {
                        store.set('data', JSON.parse(JSON.stringify(parent.$("body").data())));
                        forceStoreControl();
                    }
                }
            } else {
                store.set('data', JSON.parse(JSON.stringify(parent.$("body").data())));
                forceStoreControl();
            }
        }
    } else {
        var data = returnCleanData(dropItems);
        if (data.length > cookieMax) {
            dropItems += 1;
            data = returnCleanData(dropItems);
        } else {
            if (dropItems > 0 && (data.length + 100) < cookieMax) {
                dropItems = 0;
                data = returnCleanData(dropItems);
            }
        }
        if (data.length > cookieMax) {
            window.setTimeout(function () {
                updateStackData();
            }, 5000);
        }
        if (data.length > 3) {
            $.cookie("displaying", data, {expires: 5 * 365, path: '/'});
            window.reloadInterval = 10;
        }
    }
}

function returnCleanData(loose) {
    if (!loose) {
        loose = 0;
    }
    var save = JSON.parse(JSON.stringify(parent.$("body").data()));
    delete save.domains;
    delete save.disp;
    delete save.meta;
    delete save.colours;
    delete save.tree;
    delete save.available;
    delete save.ref_txt;
    var t;
    var l;
    var c = totalItemCount();
    for (t in save) {
        if (t.indexOf('VFBt_') > -1) {
            delete save[t].current;
            delete save[t].meta;
            delete save[t].domains;
            delete save[t].available;
            if (save[t].selected["5"]) {
                for (l in save[t].selected) {
                    if (parseInt(l) > (c - loose)) {
                        delete save[t].selected[l];
                    } else {
                        delete save[t].selected[l].name;
                        delete save[t].selected[l].type;
                        if (c > 100) {
                            delete save[t].selected[l].visible;
                        }
                    }
                }
            }
        }
    }
    save = JSON.stringify(save);
    save = compressJSONdata(save);
    return save;
}

function compressJSONdata(data) {
    var i;
    var count = 1000;
    while (data.indexOf('auto') > -1 && count > 0) {
        data = data.replace(',"visible":true', '').replace(',"colour":"auto"', '');
        count--;
    }
    count = 1000;
    while (data.indexOf('"id"') > -1 && count > 0) {
        data = data.replace('"name"', '"N"').replace('"type"', '"t"').replace('"typeid"', '"I"').replace('"extid"', '"e"').replace('"current"', '"C"').replace('"selected"', '"S"');
        data = data.replace('"template"', '"T"').replace('"visible"', '"v"').replace('"selected"', '"S"').replace('"colour"', '"c"').replace('"id"', '"i"');
    }
    for (i in CompKey) {
        count = 1000;
        while (data.indexOf(CompKey[i]) > -1 && count > 0) {
            data = data.replace(CompKey[i], '!' + String(i));
        }
    }
    for (i in CompMax) {
        count = 1000;
        while (data.indexOf(CompMax[i]) > -1 && count > 0) {
            data = data.replace(CompMax[i], '!' + String(i));
        }
    }
    return data;
}

function decompressJSONdata(data) {
    var i;
    var j;
    var count = 0;
    var keys = Object.keys(CompMax).reverse();
    for (j = 0; j < keys.length; j++) {
        count = 1000;
        i = keys[j];
        while (data.indexOf('!' + String(i)) > -1 && count > 0) {
            data = data.replace('!' + String(i), CompMax[i]);
        }
    }
    keys = Object.keys(CompKey).reverse();
    for (j = 0; j < keys.length; j++) {
        count = 1000;
        i = keys[j];
        while (data.indexOf('!' + String(i)) > -1 && count > 0) {
            data = data.replace('!' + String(i), CompKey[i]);
        }
    }
    var patt = new RegExp('"[A-z]":');
    count = 1000;
    while (patt.test(data) && count > 0) {
        data = data.replace('"C"', '"current"').replace('"N"', '"name"').replace('"t"', '"type"').replace('"I"', '"typeid"').replace('"T"', '"template"').replace('"c"', '"colour"').replace('"v"', '"visible"').replace('"S"', '"selected"').replace('"e"', '"extid"');
        data = data.replace('"i"', '"id"');
        count--;
    }
    return data;
}

function expandCookieDisplayed() {
    if (store.enabled) {
        if ($.isFunction($.removeCookie) && ($.removeCookie('displaying', {path: '/'}) || $.removeCookie('cookie-box', {path: '/'}) || $.removeCookie('dev-box', {path: '/'}) )) {
            alertMessage('removing old unused cookies');
        }
        return store.get('data');
    } else {
        var data = $.cookie("displaying");
        data = decompressJSONdata(data);
        data = JSON.parse(data);
        var layer;
        var template;
        for (template in data) {
            if (data[template].selected) {
                for (layer in data[template].selected) {
                    if (data[template].selected[layer].colour === undefined) {
                        data[template].selected[layer].colour = "auto";
                    }
                    if (data[template].selected[layer].visible === undefined) {
                        data[template].selected[layer].visible = true;
                    }
                }
            }
        }
        return data;
    }
}

function totalItemCount() {
    var i = 0;
    var j;
    for (j in parent.$("body").data()) {
        if ((j.indexOf('VFBt_') > -1) && parent.$("body").data(j).selected) {
            i += Object.keys(parent.$("body").data(j).selected).length - 1;
        }
    }
    return i;
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(string, find, replace) {
    return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function clearAbsolutlyAllData() {
    console.log('User requested clearance:');
    loadDefaultData();
    var selected;
    var i;
    var j;
    for (j in parent.$("body").data()) {
        if ((j.indexOf('VFBt_') > -1) && parent.$("body").data(j).selected) {
            selected = parent.$("body").data(j).selected;
            for (i in selected) {
                if (i > 0) {
                    delete selected[i];
                } else {
                    selected[i].colour = "auto";
                }
            }
        }
    }
    backgroundLoadMeta();
    updateStackData();
    parent.$('body').data('disp', 'scale');
}

function clearAllData() {
    var current = parent.$("body").data("current");
    var selected = parent.$("body").data(current.template).selected;
    var i;
    for (i in selected) {
        if (i > 0) {
            delete selected[i];
        }
    }
    backgroundLoadMeta();
    updateStackData();
}

function defaultScaleByScreen() {
    var scale = 1.0;
    if ($('body').data('meta') && $('#viewer-panel')) {
        if (1109 < $(window).width()) {
            if ($('#right-panel').width() + 30 < $(window).width()) {
                scale = parseFloat(Math.floor((parseFloat($(window).width() - ($('#right-panel').width() + 31)) / parseFloat(Math.ceil($('body').data('meta').extent.split(',')[0] * $('body').data('meta').voxel.split(',')[0]) + 32)) * 10.0) / 10.0);
            } else {
                scale = parseFloat(Math.floor((parseFloat(($(window).width() / 12.0) * 5.0) / parseFloat(Math.ceil($('body').data('meta').extent.split(',')[0] * $('body').data('meta').voxel.split(',')[0]) + 31)) * 10.0) / 10.0);
            }
        } else {
            scale = parseFloat(Math.floor(($(window).width() / parseFloat(Math.ceil($('body').data('meta').extent.split(',')[0] * $('body').data('meta').voxel.split(',')[0]) + 50)) * 10.0) / 10.0);
        }
    }
    return scale;
}

function loadDefaultData(ids) {
    console.log('Clearing back to default');
    forceStoreControl();
    var text = '{ "template": "VFBt_001","scl":' + String(defaultScaleByScreen()) + ',"mod":"zeta","slice":"Z","dst":0.0,"pit":0.0,"yaw":0.0,"rol":0.0,"qlt":80,"cvt":"png","fxp":"0,0,0","alpha": 100,"blend":"screen","inverted":false}';
    parent.$("body").data("current", JSON.parse(text));
    parent.$("body").data("VFBt_001", {selected: {0: {id: "VFBt_00100000", colour: "auto", visible: true}}});
    loadTemplateMeta("VFBt_001");
    parent.$("body").data("VFBt_002", {selected: {0: {id: "VFBt_00200000", colour: "auto", visible: true}}});
    parent.$("body").data("VFBt_003", {selected: {0: {id: "VFBt_00300000", colour: "auto", visible: true}}});
    parent.$("body").data("VFBt_004", {selected: {0: {id: "VFBt_00400000", colour: "auto", visible: true}}});
    updateStackData();
    if (ids !== undefined && ids !== null && ids !== "") {
        addToStackData(ids);
    }
    updateStackData();
}

function initStackData(ids) {
    if (store.enabled) {
        forceStoreControl();
        if (!store.has('data')) {
            console.log('initialising data store');
            loadDefaultData(ids);
        }
        if (store.has('data') && JSON.stringify(store.get('data')) != '{}') {
            //console.log('loading stored data:');
            //console.log(JSON.stringify(store.get('data')));
            parent.$("body").data(expandCookieDisplayed());
        } else {
            console.log('delayed load');
            window.setTimeout(function () {
                initStackData(ids);
            }, 10);
            return;
        }
    } else {
        console.log('falling back to cookies!');
        if (!$.cookie('displaying')) {
            console.log('no cookie');
            loadDefaultData(ids);
        } else {
            if (ids) {
                parent.$("body").data(expandCookieDisplayed());
                addToStackData(ids);
            }
        }
    }
    parent.$("body").data(expandCookieDisplayed());
    if (parent.$("body").data("current") === undefined) {
        alertMessage("Invalid cookie! Sorry your settings have got currupted so we will have to clear them.");
        alertMessage("Previous: " + $.cookie("displaying"));
        alertMessage(returnCleanData(0));
        $.cookie("displaying", null, {expires: -5, path: '/'});
        loadDefaultData(ids);
        location.reload();
    }
    loadTemplateMeta(parent.$("body").data("current").template);
    updateStackData();
}

function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length - size);
}

function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);
            form.appendChild(hiddenField);
        }
    }
    document.body.appendChild(form);
    form.submit();
}

function alertMessage(message) {
    try {
        console.log(message);
        ga('send', 'event', 'code', 'alert', message);
    } catch (ignore) {

    }
}

function returnCurrentUrl() {
    if (typeof returnFullUrl !== 'undefined' && $.isFunction(returnFullUrl)) {
        return returnFullUrl();
    } else {
        return window.location.pathname;
    }
}

function openFullDetails(id) {
    if (!detailLoad) {
        if ($('#anatomyDetails').length) {
            id = cleanIdforExt(id);
            if ($('#partId') === undefined || $('#partId').text() != id) {
                detailLoad = true;
                // watchdog for failed loading:
                window.setTimeout(function () {
                    if ($('#anatomyDetails').html() == '<img src="/images/tools/ajax-loader.gif" alt="loading...">') {
                        $('#anatomyDetails').html('Click anywhere on the stack viewer or use the Search or Anatomy menu tabs to select an anatomy term.<br/><br/>Information for the selected anatomical term will be displayed here, with further query options visible after selection.');
                    }
                    detailLoad = false;
                }, 3000);
                if (id.indexOf("VFBt_") < 0 && id.indexOf("VFBd_") < 0) {
                    if (id.indexOf("FBbt_") > -1 || id.indexOf("VFB_") > -1) {
                        if (id.indexOf("_a") > -1) {
                            window.open('http://vfbaligner.inf.ed.ac.uk/admin/images/alignment/' + String(parseInt(id.replace('VFB_a', ''))) + '/', '_blank');
                            //window.setTimeout(function(){try {history.pushState( {}, 'VirtualFlyBrain - ' + cleanIdforExt(id), returnCurrentUrl() + '&id=' + cleanIdforExt(id) );}catch (ignore){}}, 500);
                        } else {
                            $('#anatomyDetails').html('<img src="/images/tools/ajax-loader.gif" alt="loading...">');
                            $('#anatomyDetails').load("/do/ont_bean.html?id=" + id.replace('_', ':'));
                            //window.setTimeout(function(){try {history.pushState( {}, 'VirtualFlyBrain - ' + cleanIdforExt(id), returnCurrentUrl() + '&id=' + cleanIdforExt(id) );}catch (ignore){}}, 500);
                        }
                    } else if (id.indexOf("FB") > -1) {
                        $('#anatomyDetails').html('<img src="/images/tools/ajax-loader.gif" alt="loading...">');
                        $('#anatomyDetails').html('<a class="btn btn-info btn-sm" href="http://flybase.org/reports/' + id.replace('_', '') + '" target="_blank">FlyBase report for ' + id.replace('_', '') + '</a>');
                        //window.setTimeout(function(){try {history.pushState( {}, 'VirtualFlyBrain - ' + cleanIdforExt(id), returnCurrentUrl() + '&id=' + cleanIdforExt(id) );}catch (ignore){}}, 500);
                    } else {
                        alertMessage("Can't open details for:" + id);
                    }
                } else {
                    if (parent.$("body").data("domains") && (id.indexOf('VFBd_') > -1 || id.indexOf('VFBt_') > -1)) {
                        var current = parent.$("body").data("current");
                        var selected = parent.$("body").data(current.template).selected;
                        var temp = parseInt(id.replace(current.template, '').replace(current.template.replace('VFBt_', 'VFBd_'), ''));
                        var layers;
                        for (layers in parent.$("body").data("domains")) {
                            if (parent.$("body").data("domains")[layers].domainData.domainId && parseInt(parent.$("body").data("domains")[layers].domainData.domainId) == temp) {
                                temp = parent.$("body").data("domains")[layers];
                                id = cleanIdforExt(temp.extId[0]);
                                $('#anatomyDetails').html('<img src="/images/tools/ajax-loader.gif" alt="loading...">');
                                $('#anatomyDetails').load("/do/ont_bean.html?id=" + cleanIdforExt(temp.extId[0]).replace('_', ':'));
                                //window.setTimeout(function(){try {history.pushState( {}, 'VirtualFlyBrain - ' + cleanIdforExt(id), returnCurrentUrl() + '&id=' + cleanIdforExt(temp.extId[0]) );}catch (ignore){}}, 500);
                                break;
                            }
                        }
                    } else {
                        alertMessage("Can't directly open details for:" + id);
                    }
                }
                if (document.getElementById('details')) {
                    //jump('details');
                    if (id.length > 3 && (history.state === null | (history.state !== null && history.state.id === undefined) || (history.state !== null && history.state.id === undefined && history.state.id != cleanIdforExt(id)))) {
                        window.setTimeout(function () {
                            if (history.state === null | location.href.indexOf('#') > -1 || location.href.indexOf('?') < 0) {
                                history.replaceState({"id": id}, $('#partName').text(), location.pathname + "?id=" + cleanIdforExt(id));
                            } else {
                                history.pushState({"id": id}, $('#partName').text(), location.pathname + "?id=" + cleanIdforExt(id));
                            }
                        }, 800);
                    }
                }
                try {
                    ga('send', 'event', 'load', 'details', id);
                } catch (ignore) {
                }
            } else {
                console.log(id + ' already displayed');
            }
        } else {
            post('/site/stacks/index.htm', {'add': cleanIdforInt(id), 'id': cleanIdforInt(id)});
        }
    }
}

function addToStackData(ids, showDetails) {
    if (ids !== undefined && ids !== null) {
        showDetails = typeof showDetails !== 'undefined' ? showDetails : true;
        window.reloadInterval = 10;
        if (parent.$("body").data("current") && parent.$("body").data("meta") && parent.$("body").data("domains") && parent.$("body").data("available")) {
            $('#canvas').css('cursor', 'wait');
            forceStoreControl();
            var id;
            var i;
            var detailReq = !showDetails;
            var text;
            var selected;
            var layers;
            var temp;
            var j;
            if (ids.indexOf(',') > -1) {
                ids = ids.split(',');
            }
            if (!Array.isArray(ids)) {
                ids = [ids];
            }
            if (typeof openTab !== 'undefined' && $.isFunction(openTab)) {
                openTab('disp');
            }
            for (i in ids) {
                id = cleanIdforInt(ids[i]);
                try {
                    try {
                        ga('send', 'event', 'viewer', 'add', cleanIdforExt(id));
                    } catch (ignore) {
                    }
                    if (id.indexOf("VFBt_") > -1) {
                        id = id.replace("00000", "");
                        if (id != parent.$("body").data("current").template) {
                            parent.$("body").data("current").template = id;
                            text = '{ "template": "' + id + '","scl":' + String(defaultScaleByScreen()) + ',"mod":"zeta","slice":"Z","dst":0.0,"pit":0.0,"yaw":0.0,"rol":0.0,"qlt":80,"cvt":"png","fxp":"0.0,0.0,0.0","alpha": 100,"blend":"screen","inverted":false}';
                            parent.$("body").data("current", JSON.parse(text));
                            loadTemplateMeta(id);
                            if (!parent.$("body").data(id)) {
                                text = '{"selected":{"0":{"id":"' + id + "00000" + '","colour":"auto","visible":true}}}';
                                parent.$("body").data(id, JSON.parse(text));
                            }
                            parent.$("body").data("disp", "scale");
                            updateStackData();
                            //try {history.pushState( {}, parent.$("body").data("meta").name, '/site/stacks/index.htm?add='+id );}catch (ignore){}
                            //  if (window.location.pathname == "/site/stacks/index.htm"){
                            //    location.href=location.href.replace(location.hash,"").replace('#','');
                            //  }
                        }
                    } else if (id.indexOf("VFBi_a") > -1) {
                        selected = parent.$("body").data(parent.$("body").data("current").template).selected;
                        if (JSON.stringify(selected).indexOf(id) > -1) {
                            for (layers in selected) {
                                if (cleanIdforInt(selected[layers].id) == id) {
                                    selected[layers].visible = true;
                                }
                            }
                        } else {
                            text = '{"id":"' + id + '","name":"' + id + '","type":"user aligned data","colour":"auto","visible":true}';
                            layers = Object.keys(selected).length;
                            selected[layers] = JSON.parse(text);
                            if (parent.$("body").data("current").inverted) {
                                parent.$("body").data("current").alpha = 255;
                            } else {
                                parent.$("body").data("current").alpha = 100;
                            }
                        }
                    } else if (id.indexOf("VFBi_") > -1) {
                        selected = parent.$("body").data(parent.$("body").data("current").template).selected;
                        if (JSON.stringify(selected).indexOf(id) > -1) {
                            for (layers in selected) {
                                if (cleanIdforInt(selected[layers].id) == id) {
                                    selected[layers].visible = true;
                                    if (!detailReq) {
                                        openFullDetails(cleanIdforExt(id));
                                        detailReq = true;
                                    }
                                }
                            }
                        } else {
                            text = '{"id":"' + id + '","colour":"auto","visible":true}';
                            layers = Object.keys(selected).length;
                            selected[layers] = JSON.parse(text);
                            if (parent.$("body").data("current").inverted) {
                                parent.$("body").data("current").alpha = 255;
                            } else {
                                parent.$("body").data("current").alpha = 100;
                            }
                        }
                    } else if (id.indexOf("VFBd_") > -1) {
                        selected = parent.$("body").data(parent.$("body").data("current").template).selected;
                        if (JSON.stringify(selected).indexOf(id) > -1) {
                            for (layers in selected) {
                                if (cleanIdforInt(selected[layers].id) == id) {
                                    selected[layers].visible = true;
                                    if (!detailReq) {
                                        openFullDetails(cleanIdforInt(selected[layers].extid));
                                        detailReq = true;
                                    }
                                }
                            }
                        } else {
                            layers = Object.keys(selected).length;
                            text = '{"id":"' + id + '","colour":"auto","visible":true, "extid":"';
                            for (layers in parent.$("body").data("domains")) {
                                if (parseInt(parent.$("body").data("domains")[layers].domainData.domainId) == parseInt(id.substr(8))) {
                                    text += cleanIdforInt(parent.$("body").data("domains")[layers].extId[0]) + '"';
                                    text += ',"L":"' + layers + '"';
                                    if (parent.$("body").data("domains")[layers].type !== undefined) {
                                        text += ',"type":"' + parent.$("body").data("domains")[layers].type + '"';
                                    }
                                    if (parent.$("body").data("domains")[layers].typeId !== undefined) {
                                        text += ',"typeid":"' + parent.$("body").data("domains")[layers].typeId + '"';
                                    }
                                    if (!detailReq) {
                                        openFullDetails(cleanIdforInt(parent.$("body").data("domains")[layers].extId[0]));
                                        detailReq = true;
                                    }
                                    break;
                                }
                            }
                            text += "}";
                            layers = Object.keys(selected).length;
                            selected[layers] = JSON.parse(text);
                        }
                    } else if (id.indexOf("FBbt_") > -1) {
                        if (!detailReq) {
                            openFullDetails(id);
                            detailReq = true;
                        }
                        selected = parent.$("body").data(parent.$("body").data("current").template).selected;
                        if (JSON.stringify(selected).indexOf(id) > -1) {
                            for (layers in selected) {
                                if (cleanIdforInt(selected[layers].extid) == id) {
                                    selected[layers].visible = true;
                                }
                            }
                        } else {
                            layers = Object.keys(selected).length;
                            if (parent.$("body").data("available").indexOf(id) > -1) {
                                text = '{"id":"';
                                for (layers in parent.$("body").data("domains")) {
                                    if (cleanIdforInt(parent.$("body").data("domains")[layers].extId[0]) == id) {
                                        if (parent.$("body").data("domains")[layers].domainData.domainId === "") {
                                            alertMessage(id + ' not found in current stack');
                                        } else {
                                            temp = parent.$("body").data("current").template.replace("VFBt_", "VFBd_") + String(pad(parseInt(parent.$("body").data("domains")[layers].domainData.domainId), 5));
                                            if (JSON.stringify(selected).indexOf(temp) > -1) {
                                                for (j in selected) {
                                                    if (cleanIdforInt(selected[j].id) == temp) {
                                                        selected[j].visible = true;
                                                        break;
                                                    }
                                                }
                                            } else {
                                                text += temp + '","colour":"auto","visible":true, "extid":"' + id + '"';
                                                text += ',"L":"' + layers + '"';
                                                if (parent.$("body").data("domains")[layers].type !== undefined) {
                                                    text += ',"type":"' + parent.$("body").data("domains")[layers].type + '"';
                                                }
                                                if (parent.$("body").data("domains")[layers].typeId !== undefined) {
                                                    text += ',"typeid":"' + parent.$("body").data("domains")[layers].typeId + '"';
                                                }
                                                text += '}';
                                            }
                                        }
                                        break;
                                    }
                                }
                                layers = Object.keys(selected).length;
                                selected[layers] = JSON.parse(text);
                            }
                        }
                    } else if (id.indexOf("FBgn") > -1) {
                        selected = parent.$("body").data(parent.$("body").data("current").template).selected;
                        if (JSON.stringify(selected).indexOf(id) > -1) {
                            for (layers in selected) {
                                if (cleanIdforInt(selected[layers].extid) == id) {
                                    selected[layers].visible = true;
                                }
                            }
                        } else {
                            layers = Object.keys(selected).length;
                            if (parent.$("body").data("available").indexOf(id) > -1) {
                                text = '{"id":"';
                                for (layers in parent.$("body").data("domains")) {
                                    if (cleanIdforInt(parent.$("body").data("domains")[layers].extId[0]) == id) {
                                        if (parent.$("body").data("domains")[layers].domainData.domainId === "") {
                                            alertMessage(id + ' not found in current stack');
                                        } else {
                                            temp = parent.$("body").data("current").template.replace("VFBt_", "VFBd_") + String(pad(parseInt(parent.$("body").data("domains")[layers].domainData.domainId), 5));
                                            if (JSON.stringify(selected).indexOf(temp) > -1) {
                                                for (j in selected) {
                                                    if (cleanIdforInt(selected[j].id) == temp) {
                                                        selected[j].visible = true;
                                                        break;
                                                    }
                                                }
                                            } else {
                                                text += temp + '","colour":"auto","visible":true, "extid":"' + id + '" }';
                                            }
                                        }
                                        break;
                                    }
                                }
                            }
                            layers = Object.keys(selected).length;
                            selected[layers] = JSON.parse(text);
                        }
                    }
                } catch (e) {
                    alertMessage('Issue adding id:' + id + String(e));
                }
            }
            updateStackData();
            history.replaceState(null, document.title, location.href);
        } else {
            window.setTimeout(function () {
                addToStackData(ids);
            }, 1000);
        }
        if (typeof updateMenuData !== 'undefined' && $.isFunction(updateMenuData)) {
            updateMenuData();
        }
    }
}

function forceStoreControl() {
    store.set('updated', JSON.parse('{"session":"' + window.id + '","time":' + Date.now() + '}'));
}

var vis = (function () {
    var stateKey, eventKey, keys = {
        hidden: "visibilitychange",
        webkitHidden: "webkitvisibilitychange",
        mozHidden: "mozvisibilitychange",
        msHidden: "msvisibilitychange"
    };
    for (stateKey in keys) {
        if (stateKey in document) {
            eventKey = keys[stateKey];
            break;
        }
    }
    return function (c) {
        if (c) document.addEventListener(eventKey, c);
        return !document[stateKey];
    }
})();

vis(function () {
    updateStackData();
    if (vis()) {
        forceStoreControl();
        document.title = document.title.replace("*", "");
    } else {
        window.setTimeout(function () {
            if ((!vis()) && store.get("updated").session != window.id && document.title.indexOf('*') < 0) {
                document.title = "*" + document.title;
            }
        }, 2000);
    }
});

function removeFromStackData(ids) {
    if (ids !== undefined && ids !== null) {
        window.reloadInterval = 10;
        var i;
        var l;
        var id;
        var current = parent.$("body").data("current");
        var selected = parent.$("body").data(current.template).selected;
        forceStoreControl();
        if (!Array.isArray(ids)) {
            ids = [ids];
        }
        for (i in ids) {
            id = cleanIdforInt(ids[i]);
            try {
                ga('send', 'event', 'viewer', 'remove', cleanIdforExt(id));
            } catch (ignore) {
            }
            if (JSON.stringify(selected).indexOf(id) > -1) {
                if (id.indexOf("VFBi_") > -1) {
                    for (l in selected) {
                        if (selected[l].id == id) {
                            delete selected[l];
                            if (typeof $.fn.dataTable !== 'undefined' && $.fn.dataTable.isDataTable('#displayed')) {
                                $('#displayed').dataTable().fnDeleteRow(parseInt(l), false);
                                $('#displayed').DataTable().draw(false);
                            }
                        }
                    }
                } else {
                    if (id.indexOf("FBbt_") > -1) {
                        for (l in selected) {
                            if (cleanIdforInt(selected[l].extid) == id) {
                                if (selected[l].id.indexOf('VFBt_') < 0) {
                                    delete selected[l];
                                    if (typeof $.fn.dataTable !== 'undefined' && $.fn.dataTable.isDataTable('#displayed')) {
                                        $('#displayed').dataTable().fnDeleteRow(parseInt(l), false);
                                        $('#displayed').DataTable().draw(false);
                                    }
                                }
                            }
                        }
                    } else if (id.indexOf("VFBd_") > -1) {
                        for (l in selected) {
                            if (cleanIdforInt(selected[l].id) == id) {
                                delete selected[l];
                                if (typeof $.fn.dataTable !== 'undefined' && $.fn.dataTable.isDataTable('#displayed')) {
                                    $('#displayed').dataTable().fnDeleteRow(parseInt(l), false);
                                    $('#displayed').DataTable().draw(false);
                                }
                            }
                        }
                    }
                }
            }
        }
        selected = parent.$("body").data(current.template).selected;
        i = 0;
        for (l in selected) {
            selected[i] = selected[l];
            i++;
        }
        selected = parent.$("body").data(current.template).selected;
        for (l in selected) {
            if (parseInt(l) > i - 1) {
                delete selected[l];
            }
        }
        updateStackData();
    }
}

function uniq_json(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for (var i = 0; i < len; i++) {
        var item = JSON.stringify(a[i]);
        if (seen[item] !== 1) {
            seen[item] = 1;
            out[j++] = JSON.parse(item);
        }
    }
    return out;
}

function returnGeppettoConfUrl() {
    var current = parent.$("body").data("current");
    if (current) {
        var selected = parent.$("body").data(current.template).selected;
        var i;
        var displayed = "";
        var template = current.template;
        var diffs = "";
        for (i in selected) {
            if (i > 0) {
                displayed += "," + cleanIdforExt(selected[i].id);
                if (cleanIdforExt(selected[i].colour).indexOf('auto') < 0) {
                    diffs += "," + cleanIdforExt(selected[i].id) + "-" + rgbColToHex(selected[i].colour).replace("#", "0x");
                }
            }
        }
        if (displayed.length > 1) {
            displayed = displayed.substr(1);
        }
        if (diffs.length > 1) {
            diffs = diffs.substr(1);
        }
        return "http://" + window.location.host + "/do/geppettoJson.json?i=" + displayed + "%26t=" + template + "%26d=" + diffs;
    } else {
        return "http://" + window.location.host + "/do/geppettoJson.json";
    }
}

function thumbnailHTMLForId(id) {
    id = cleanIdforInt(id);
    var url = "";
    var html = '<img class="lazy thumb_sm" data-original="URL" onclick="';
    html += "openFullDetails('" + id + "');";
    html += '" alt="click to see full details" />';
    if (id.indexOf("VFBi_") > -1) {
        url = "/data/VFB/i/" + id.substr(5, 4) + "/" + id.substr(9, 4) + "/thumbnail.png";
        return html.replace('"URL"', '"' + url + '"');
    }
    var current = parent.$('body').data("current");
    var fxp = String(current.fxp);
    if (id.indexOf("VFBd_") > -1) {
        url = fileFromId(id.substr(0, 8).replace('VFBd', 'VFBt'));
        if ($('#centreFor' + id).data()) {
            fxp = $('#centreFor' + id).data('centre');
        }
        url = "/fcgi/wlziipsrv.fcgi?wlz=/disk/data/VFB/IMAGE_DATA/" + url + "&sel=0,255,0,255&sel=" + String(parseInt(id.substr(8))) + ",0,255,0,150&fxp=" + fxp + "&scl=0.2&dst=0&pit=" + current.pit + "&yaw=" + current.yaw + "&rol=" + current.rol + "&qlt=" + current.qlt + "&cvt=" + current.cvt;
        return html.replace('"URL"', '"' + url + '"');
    }
    if (id.indexOf("VFBt_") > -1) {
        url = fileFromId(id);
        url = "/fcgi/wlziipsrv.fcgi?wlz=/disk/data/VFB/IMAGE_DATA/" + url + "&sel=0,0,255,0&fxp=" + fxp + "&scl=0.2&dst=0&pit=" + current.pit + "&yaw=" + current.yaw + "&rol=" + current.rol + "&qlt=" + current.qlt + "&cvt=" + current.cvt;
        return html.replace('"URL"', '"' + url + '"');
    }
    return "";
}

function checkSearchValue() {
    var val = $('#searchtext').val();
    var exists = false;
    var k;
    for (k = searchresults.length - 1; k >= 0; --k) {
        try {
            if (searchresults[k].syn.toUpperCase() == val.toUpperCase()) {
                exists = true;
                var endVal = k;
            }
        } catch (ignore) {
            alertMessage("Issue with result: " + JSON.stringify(searchresults[k]));
        }
    }
    if (exists) {
        $('#searchid').text(searchresults[endVal].id);
        $('#searchgroup').removeClass('has-warning').addClass('has-success');
        $('#searchtext').css('color', 'rgb(92,184,92)');
        $('#searchtext').attr('data-original-title', 'MATCH: press return/enter to get details').tooltip('fixTitle').tooltip('show');
        window.setTimeout(function () {
            if (lastkey < (Date.now() - 1000) && $('#searchtext').val() == $('.tt-suggestion > b').first().text()) {
                $('.tt-suggestion').first().click();
            }
        }, 5000);
    } else {
        if (val.length > 0) {
            $('#searchgroup').addClass('has-warning').removeClass('has-success');
            $('#searchtext').css('color', 'rgb(235,150,29)');
            if (searchresults[0].syn.indexOf($('#searchtext').val()) > -1) {
                $('#searchtext').attr('data-original-title', 'press return/enter accept default [' + $('#searchresults').find('option').first().val() + ']').tooltip('fixTitle').tooltip('show');
            } else {
                $('#searchtext').attr('data-original-title', 'continue typing or select from list').tooltip('fixTitle').tooltip('show');
            }
        } else {
            $('#searchgroup').removeClass('has-success').removeClass('has-warning');
            $('#searchtext').css('color', 'black');
            $('#searchtext').attr('data-original-title', $('#searchtext').attr('title')).tooltip('fixTitle').tooltip('show');
        }
    }
}

function hasValue(obj, key, value) {
    return obj.hasOwnProperty(key) && obj[key] === value;
}

function executeSearch() {
    if ($('#searchgroup').hasClass('has-success')) {
        alertMessage('Opening details for ' + $('#searchid').text());
        clickSearchResult($('#searchid').text());
    } else {
        if ($('.tt-hint').val().indexOf($('#searchtext').val()) > -1) {
            $('.typeahead').typeahead('val', $('.tt-hint').val());
            if ($('.tt-suggestion > b').first().text() == $('.tt-hint').val()) {
                $('.tt-suggestion').first().click();
            }
        }
        if ($('#searchtext').val().toUpperCase().indexOf('VFB') > -1 || $('#searchtext').val().toUpperCase().indexOf('FBBT') > -1) {
            if (searchresults[0].id == $('#searchtext').val().replace(':', '_')) {
                clickSearchResult(searchresults[0].id);
            } else {
                $('#searchgroup').addClass('has-info');
            }
        }
    }
}

function clickSearchResult(id) {
    openFullDetails(id);
    addToStackData(id);
    $('.typeahead').typeahead('close');
    $('#searchgroup').removeClass('has-success').removeClass('has-warning').removeClass('has-info');
    $('#searchtext').attr('data-original-title', $('#searchtext').attr('title')).tooltip('fixTitle').tooltip('show');
    $('.typeahead').typeahead('val', '');
    $("#searchtext").css('width', 146);
    $('.tt-hint').css('width', 146);
    $('#searchtext').val('');
    $('#searchtext').focus();
    checkSearchValue();
    $('#searchtext').tooltip('hide');
}

function initialiseSearchResults() {
    var val = '';
    console.log('Initialising search...');
    try {
        $.getJSON('/search/select?hl=true&fl=short_form,label,synonym,id,type,has_narrow_synonym_annotation,has_broad_synonym_annotation&start=0&fq=ontology_name:(fbbt)&fq=is_obsolete:false&fq=shortform_autosuggest:VFB_*%20OR%20shortform_autosuggest:FBbt_*&rows=250&hl.simple.pre=<b>&bq=is_defining_ontology:true^100.0%20label_s:"' + val + '"^2%20synonym_s:"' + val + '"%20in_subset_annotation:BRAINNAME^3%20short_form:FBbt_00003982^2&q=*' + val + '*&defType=edismax&hl.simple.post:</b>&qf=label%20synonym%20label_autosuggest_ws%20label_autosuggest_e%20label_autosuggest%20synonym_autosuggest_ws%20synonym_autosuggest_e%20synonym_autosuggest%20shortform_autosuggest%20has_narrow_synonym_annotation%20has_broad_synonym_annotation&hl.fl=label_autosuggest&hl.fl=label&hl.fl=synonym_autosuggest&hl.fl=synonym&wt=json&indent=true', function (data) {
            var resl = "";
            var top;
            var i;
            var j;
            var opt;
            var newresults = [];
            for (i in data.response.docs) {
                if (data.response.docs[i].label) {
                    resl = data.response.docs[i].short_form;
                    if (i == '0') {
                        top = resl;
                        $('#searchid').text(resl);
                    }
                }
                opt = {name: data.response.docs[i].label, syn: resl, id: resl};
                newresults.push(opt);
                opt = {name: data.response.docs[i].label, syn: data.response.docs[i].label, id: resl};
                newresults.push(opt);
                for (j in data.response.docs[i].synonym) {
                    if (data.response.docs[i].label != data.response.docs[i].synonym[j]) {
                        opt = {name: data.response.docs[i].label, syn: data.response.docs[i].synonym[j], id: resl};
                        newresults.push(opt);
                    }
                }
                if (data.response.docs[i].has_narrow_synonym_annotation) {
                    for (j in data.response.docs[i].has_narrow_synonym_annotation) {
                        opt = {
                            name: data.response.docs[i].label,
                            syn: data.response.docs[i].has_narrow_synonym_annotation[j],
                            id: resl
                        };
                        newresults.push(opt);
                    }
                }
                if (data.response.docs[i].has_broad_synonym_annotation) {
                    for (j in data.response.docs[i].has_broad_synonym_annotation) {
                        opt = {
                            name: data.response.docs[i].label,
                            syn: data.response.docs[i].has_broad_synonym_annotation[j],
                            id: resl
                        };
                        newresults.push(opt);
                    }
                }
            }
            while (searchresults.length > 0) {
                resl = searchresults.pop();
                if (!hasValue(newresults, 'id', resl.id)) {
                    newresults.push(resl);
                }
            }
            searchresults = uniq_json(newresults);
            engine.add(searchresults);
            createAutocompleteList();
        });
    } catch (err) {
        console.log('Search (SOLR) server appears to be offline!');
        console.log(err.message);
        searchresults = [{
            "name": "antennal mechanosensory and motor center",
            "syn": "FBbt_00003982",
            "id": "FBbt_00003982"
        }, {
            "name": "antennal mechanosensory and motor center",
            "syn": "antennal mechanosensory and motor center",
            "id": "FBbt_00003982"
        }, {
            "name": "antennal mechanosensory and motor center",
            "syn": "antenno-mechanosensory center",
            "id": "FBbt_00003982"
        }, {
            "name": "antennal mechanosensory and motor center",
            "syn": "antennal mechanosensory region",
            "id": "FBbt_00003982"
        }, {
            "name": "antennal mechanosensory and motor center",
            "syn": "AMC",
            "id": "FBbt_00003982"
        }, {
            "name": "antennal mechanosensory and motor center",
            "syn": "AMMC",
            "id": "FBbt_00003982"
        }, {
            "name": "superior pharyngeal sensory center",
            "syn": "FBbt_00040052",
            "id": "FBbt_00040052"
        }, {
            "name": "superior pharyngeal sensory center",
            "syn": "superior pharyngeal sensory center",
            "id": "FBbt_00040052"
        }, {
            "name": "superior pharyngeal sensory center",
            "syn": "dorsal pharyngeal sensory center",
            "id": "FBbt_00040052"
        }, {
            "name": "superior pharyngeal sensory center",
            "syn": "SPhS",
            "id": "FBbt_00040052"
        }, {
            "name": "nodulus subunit III",
            "syn": "FBbt_00111054",
            "id": "FBbt_00111054"
        }, {
            "name": "nodulus subunit III",
            "syn": "nodulus subunit III",
            "id": "FBbt_00111054"
        }, {
            "name": "nodulus subunit III",
            "syn": "nodulus layer 3",
            "id": "FBbt_00111054"
        }, {"name": "nodulus subunit II", "syn": "FBbt_00111053", "id": "FBbt_00111053"}, {
            "name": "nodulus subunit II",
            "syn": "nodulus subunit II",
            "id": "FBbt_00111053"
        }, {
            "name": "nodulus subunit II",
            "syn": "nodulus layer 2",
            "id": "FBbt_00111053"
        }, {"name": "nodulus subunit I", "syn": "FBbt_00111052", "id": "FBbt_00111052"}, {
            "name": "nodulus subunit I",
            "syn": "nodulus subunit I",
            "id": "FBbt_00111052"
        }, {
            "name": "nodulus subunit I",
            "syn": "nodulus layer 1",
            "id": "FBbt_00111052"
        }, {"name": "nodulus subunit IV", "syn": "FBbt_00111055", "id": "FBbt_00111055"}, {
            "name": "nodulus subunit IV",
            "syn": "nodulus subunit IV",
            "id": "FBbt_00111055"
        }, {
            "name": "nodulus subunit IV",
            "syn": "nodulus layer 4",
            "id": "FBbt_00111055"
        }, {
            "name": "anterior optic tubercle",
            "syn": "FBbt_00007059",
            "id": "FBbt_00007059"
        }, {
            "name": "anterior optic tubercle",
            "syn": "anterior optic tubercle",
            "id": "FBbt_00007059"
        }, {
            "name": "anterior optic tubercle",
            "syn": "AOTU",
            "id": "FBbt_00007059"
        }, {"name": "anterior optic tubercle", "syn": "OTU", "id": "FBbt_00007059"}, {
            "name": "anterior optic tubercle",
            "syn": "OPTU",
            "id": "FBbt_00007059"
        }, {
            "name": "anterior optic tubercle",
            "syn": "optic tubercle",
            "id": "FBbt_00007059"
        }, {
            "name": "ventrolateral protocerebrum",
            "syn": "FBbt_00007058",
            "id": "FBbt_00007058"
        }, {
            "name": "ventrolateral protocerebrum",
            "syn": "ventrolateral protocerebrum",
            "id": "FBbt_00007058"
        }, {
            "name": "ventrolateral protocerebrum",
            "syn": "ventro-lateral protocerebrum",
            "id": "FBbt_00007058"
        }, {
            "name": "ventrolateral protocerebrum",
            "syn": "VLP",
            "id": "FBbt_00007058"
        }, {
            "name": "ventrolateral protocerebrum",
            "syn": "ventro-lateral adult protocerebrum",
            "id": "FBbt_00007058"
        }, {
            "name": "ventrolateral protocerebrum",
            "syn": "anterior optic foci",
            "id": "FBbt_00007058"
        }, {
            "name": "ventrolateral protocerebrum",
            "syn": "vlpr",
            "id": "FBbt_00007058"
        }, {
            "name": "ventrolateral protocerebrum",
            "syn": "OG",
            "id": "FBbt_00007058"
        }, {
            "name": "superior medial protocerebrum",
            "syn": "FBbt_00007055",
            "id": "FBbt_00007055"
        }, {
            "name": "superior medial protocerebrum",
            "syn": "superior medial protocerebrum",
            "id": "FBbt_00007055"
        }, {
            "name": "superior medial protocerebrum",
            "syn": "SMP",
            "id": "FBbt_00007055"
        }, {
            "name": "superior medial protocerebrum",
            "syn": "SDFP",
            "id": "FBbt_00007055"
        }, {"name": "superior medial protocerebrum", "syn": "IDLP", "id": "FBbt_00007055"}, {
            "name": "lateral horn",
            "syn": "FBbt_00007053",
            "id": "FBbt_00007053"
        }, {"name": "lateral horn", "syn": "lateral horn", "id": "FBbt_00007053"}, {
            "name": "lateral horn",
            "syn": "LH",
            "id": "FBbt_00007053"
        }, {
            "name": "superior lateral protocerebrum",
            "syn": "FBbt_00007054",
            "id": "FBbt_00007054"
        }, {
            "name": "superior lateral protocerebrum",
            "syn": "superior lateral protocerebrum",
            "id": "FBbt_00007054"
        }, {
            "name": "superior lateral protocerebrum",
            "syn": "SLP",
            "id": "FBbt_00007054"
        }, {
            "name": "superior lateral protocerebrum",
            "syn": "DLP",
            "id": "FBbt_00007054"
        }, {
            "name": "superior lateral protocerebrum",
            "syn": "IDLP",
            "id": "FBbt_00007054"
        }, {
            "name": "ventromedial neuropils",
            "syn": "FBbt_00040002",
            "id": "FBbt_00040002"
        }, {
            "name": "ventromedial neuropils",
            "syn": "ventromedial neuropils",
            "id": "FBbt_00040002"
        }, {"name": "ventromedial neuropils", "syn": "VMNPS", "id": "FBbt_00040002"}, {
            "name": "lateral complex",
            "syn": "FBbt_00040001",
            "id": "FBbt_00040001"
        }, {"name": "lateral complex", "syn": "lateral complex", "id": "FBbt_00040001"}, {
            "name": "lateral complex",
            "syn": "LX",
            "id": "FBbt_00040001"
        }, {"name": "inferior neuropils", "syn": "FBbt_00040037", "id": "FBbt_00040037"}, {
            "name": "inferior neuropils",
            "syn": "inferior neuropils",
            "id": "FBbt_00040037"
        }, {
            "name": "inferior neuropils",
            "syn": "inferior protocerebrum",
            "id": "FBbt_00040037"
        }, {"name": "inferior neuropils", "syn": "INP", "id": "FBbt_00040037"}, {
            "name": "accessory medulla",
            "syn": "FBbt_00045003",
            "id": "FBbt_00045003"
        }, {
            "name": "accessory medulla",
            "syn": "accessory medulla",
            "id": "FBbt_00045003"
        }, {"name": "accessory medulla", "syn": "aMe", "id": "FBbt_00045003"}, {
            "name": "accessory medulla",
            "syn": "AME",
            "id": "FBbt_00045003"
        }, {
            "name": "superior intermediate protocerebrum",
            "syn": "FBbt_00045032",
            "id": "FBbt_00045032"
        }, {
            "name": "superior intermediate protocerebrum",
            "syn": "superior intermediate protocerebrum",
            "id": "FBbt_00045032"
        }, {
            "name": "superior intermediate protocerebrum",
            "syn": "SIP",
            "id": "FBbt_00045032"
        }, {
            "name": "superior intermediate protocerebrum",
            "syn": "DLP",
            "id": "FBbt_00045032"
        }, {
            "name": "superior intermediate protocerebrum",
            "syn": "FSPP",
            "id": "FBbt_00045032"
        }, {"name": "superior neuropils", "syn": "FBbt_00045030", "id": "FBbt_00045030"}, {
            "name": "superior neuropils",
            "syn": "superior neuropils",
            "id": "FBbt_00045030"
        }, {"name": "superior neuropils", "syn": "SNP", "id": "FBbt_00045030"}, {
            "name": "central body",
            "syn": "FBbt_00045020",
            "id": "FBbt_00045020"
        }, {"name": "central body", "syn": "central body", "id": "FBbt_00045020"}, {
            "name": "central body",
            "syn": "CB",
            "id": "FBbt_00045020"
        }, {
            "name": "ventrolateral neuropils",
            "syn": "FBbt_00045021",
            "id": "FBbt_00045021"
        }, {
            "name": "ventrolateral neuropils",
            "syn": "ventrolateral neuropils",
            "id": "FBbt_00045021"
        }, {"name": "ventrolateral neuropils", "syn": "VLNP", "id": "FBbt_00045021"}, {
            "name": "saddle",
            "syn": "FBbt_00045048",
            "id": "FBbt_00045048"
        }, {"name": "saddle", "syn": "saddle", "id": "FBbt_00045048"}, {
            "name": "saddle",
            "syn": "SAD",
            "id": "FBbt_00045048"
        }, {"name": "saddle", "syn": "AMMC", "id": "FBbt_00045048"}, {
            "name": "periesophageal neuropils",
            "syn": "FBbt_00045047",
            "id": "FBbt_00045047"
        }, {
            "name": "periesophageal neuropils",
            "syn": "periesophageal neuropils",
            "id": "FBbt_00045047"
        }, {"name": "periesophageal neuropils", "syn": "PENP", "id": "FBbt_00045047"}, {
            "name": "antler",
            "syn": "FBbt_00045039",
            "id": "FBbt_00045039"
        }, {"name": "antler", "syn": "antler", "id": "FBbt_00045039"}, {
            "name": "antler",
            "syn": "ATL",
            "id": "FBbt_00045039"
        }, {"name": "antler", "syn": "CCP", "id": "FBbt_00045039"}, {
            "name": "adult maxillary neuromere",
            "syn": "FBbt_00007158",
            "id": "FBbt_00007158"
        }, {
            "name": "adult maxillary neuromere",
            "syn": "adult maxillary neuromere",
            "id": "FBbt_00007158"
        }, {
            "name": "adult mandibular neuromere",
            "syn": "FBbt_00007159",
            "id": "FBbt_00007159"
        }, {
            "name": "adult mandibular neuromere",
            "syn": "adult mandibular neuromere",
            "id": "FBbt_00007159"
        }, {
            "name": "adult labial neuromere",
            "syn": "FBbt_00007160",
            "id": "FBbt_00007160"
        }, {
            "name": "adult labial neuromere",
            "syn": "adult labial neuromere",
            "id": "FBbt_00007160"
        }, {"name": "adult brain", "syn": "FBbt_00003624", "id": "FBbt_00003624"}, {
            "name": "adult brain",
            "syn": "adult brain",
            "id": "FBbt_00003624"
        }, {
            "name": "supraesophageal ganglion",
            "syn": "FBbt_00003626",
            "id": "FBbt_00003626"
        }, {
            "name": "supraesophageal ganglion",
            "syn": "supraesophageal ganglion",
            "id": "FBbt_00003626"
        }, {
            "name": "adult central complex",
            "syn": "FBbt_00003632",
            "id": "FBbt_00003632"
        }, {
            "name": "adult central complex",
            "syn": "adult central complex",
            "id": "FBbt_00003632"
        }, {
            "name": "adult central complex",
            "syn": "adult central body complex",
            "id": "FBbt_00003632"
        }, {"name": "adult central complex", "syn": "CX", "id": "FBbt_00003632"}, {
            "name": "protocerebral bridge",
            "syn": "FBbt_00003668",
            "id": "FBbt_00003668"
        }, {
            "name": "protocerebral bridge",
            "syn": "protocerebral bridge",
            "id": "FBbt_00003668"
        }, {"name": "protocerebral bridge", "syn": "PB", "id": "FBbt_00003668"}, {
            "name": "protocerebral bridge",
            "syn": "pb",
            "id": "FBbt_00003668"
        }, {"name": "protocerebral bridge", "syn": "PCB", "id": "FBbt_00003668"}, {
            "name": "ellipsoid body",
            "syn": "FBbt_00003678",
            "id": "FBbt_00003678"
        }, {"name": "ellipsoid body", "syn": "ellipsoid body", "id": "FBbt_00003678"}, {
            "name": "ellipsoid body",
            "syn": "EB",
            "id": "FBbt_00003678"
        }, {"name": "fan-shaped body", "syn": "FBbt_00003679", "id": "FBbt_00003679"}, {
            "name": "fan-shaped body",
            "syn": "fan-shaped body",
            "id": "FBbt_00003679"
        }, {"name": "fan-shaped body", "syn": "fan shaped body", "id": "FBbt_00003679"}, {
            "name": "fan-shaped body",
            "syn": "fb",
            "id": "FBbt_00003679"
        }, {"name": "fan-shaped body", "syn": "FB", "id": "FBbt_00003679"}, {
            "name": "lateral accessory lobe",
            "syn": "FBbt_00003681",
            "id": "FBbt_00003681"
        }, {
            "name": "lateral accessory lobe",
            "syn": "lateral accessory lobe",
            "id": "FBbt_00003681"
        }, {"name": "lateral accessory lobe", "syn": "vbo", "id": "FBbt_00003681"}, {
            "name": "lateral accessory lobe",
            "syn": "ventral body",
            "id": "FBbt_00003681"
        }, {"name": "lateral accessory lobe", "syn": "LAL", "id": "FBbt_00003681"}, {
            "name": "lateral accessory lobe",
            "syn": "IDFP",
            "id": "FBbt_00003681"
        }, {"name": "nodulus", "syn": "FBbt_00003680", "id": "FBbt_00003680"}, {
            "name": "nodulus",
            "syn": "nodulus",
            "id": "FBbt_00003680"
        }, {"name": "nodulus", "syn": "ventral tubercle", "id": "FBbt_00003680"}, {
            "name": "nodulus",
            "syn": "NO",
            "id": "FBbt_00003680"
        }, {"name": "nodulus", "syn": "no", "id": "FBbt_00003680"}, {
            "name": "nodulus",
            "syn": "Nod",
            "id": "FBbt_00003680"
        }, {
            "name": "lobe system of mushroom body",
            "syn": "FBbt_00003688",
            "id": "FBbt_00003688"
        }, {
            "name": "lobe system of mushroom body",
            "syn": "lobe system of mushroom body",
            "id": "FBbt_00003688"
        }, {
            "name": "mushroom body pedunculus",
            "syn": "FBbt_00003687",
            "id": "FBbt_00003687"
        }, {
            "name": "mushroom body pedunculus",
            "syn": "mushroom body pedunculus",
            "id": "FBbt_00003687"
        }, {
            "name": "mushroom body pedunculus",
            "syn": "peduncule of mushroom body",
            "id": "FBbt_00003687"
        }, {
            "name": "mushroom body pedunculus",
            "syn": "peduncle",
            "id": "FBbt_00003687"
        }, {
            "name": "mushroom body pedunculus",
            "syn": "peduncle of mushroom body",
            "id": "FBbt_00003687"
        }, {
            "name": "mushroom body pedunculus",
            "syn": "peduncule",
            "id": "FBbt_00003687"
        }, {
            "name": "mushroom body pedunculus",
            "syn": "stalk of corpora pedunculata",
            "id": "FBbt_00003687"
        }, {
            "name": "mushroom body pedunculus",
            "syn": "PED",
            "id": "FBbt_00003687"
        }, {
            "name": "mushroom body pedunculus",
            "syn": "pedunculus",
            "id": "FBbt_00003687"
        }, {
            "name": "mushroom body pedunculus",
            "syn": "stalk of mushroom body",
            "id": "FBbt_00003687"
        }, {
            "name": "mushroom body alpha'-lobe",
            "syn": "FBbt_00003691",
            "id": "FBbt_00003691"
        }, {
            "name": "mushroom body alpha'-lobe",
            "syn": "mushroom body alpha'-lobe",
            "id": "FBbt_00003691"
        }, {
            "name": "mushroom body alpha'-lobe",
            "syn": "mushroom body alpha' lobe",
            "id": "FBbt_00003691"
        }, {
            "name": "mushroom body alpha'-lobe",
            "syn": "alpha'-lobe of mushroom body",
            "id": "FBbt_00003691"
        }, {
            "name": "mushroom body alpha'-lobe",
            "syn": "alpha'-lobe",
            "id": "FBbt_00003691"
        }, {
            "name": "mushroom body beta'-lobe",
            "syn": "FBbt_00003694",
            "id": "FBbt_00003694"
        }, {
            "name": "mushroom body beta'-lobe",
            "syn": "mushroom body beta'-lobe",
            "id": "FBbt_00003694"
        }, {
            "name": "mushroom body beta'-lobe",
            "syn": "mushroom body beta' lobe",
            "id": "FBbt_00003694"
        }, {
            "name": "mushroom body beta'-lobe",
            "syn": "beta'-lobe",
            "id": "FBbt_00003694"
        }, {
            "name": "mushroom body beta'-lobe",
            "syn": "beta'-lobe of mushroom body",
            "id": "FBbt_00003694"
        }, {
            "name": "mushroom body beta-lobe",
            "syn": "FBbt_00003693",
            "id": "FBbt_00003693"
        }, {
            "name": "mushroom body beta-lobe",
            "syn": "mushroom body beta-lobe",
            "id": "FBbt_00003693"
        }, {
            "name": "mushroom body beta-lobe",
            "syn": "beta-lobe of mushroom body",
            "id": "FBbt_00003693"
        }, {
            "name": "mushroom body beta-lobe",
            "syn": "beta-lobe",
            "id": "FBbt_00003693"
        }, {
            "name": "mushroom body beta-lobe",
            "syn": "mushroom body beta lobe",
            "id": "FBbt_00003693"
        }, {
            "name": "mushroom body alpha-lobe",
            "syn": "FBbt_00003690",
            "id": "FBbt_00003690"
        }, {
            "name": "mushroom body alpha-lobe",
            "syn": "mushroom body alpha-lobe",
            "id": "FBbt_00003690"
        }, {
            "name": "mushroom body alpha-lobe",
            "syn": "mushroom body alpha lobe",
            "id": "FBbt_00003690"
        }, {
            "name": "mushroom body alpha-lobe",
            "syn": "alpha-lobe",
            "id": "FBbt_00003690"
        }, {
            "name": "mushroom body alpha-lobe",
            "syn": "alpha L",
            "id": "FBbt_00003690"
        }, {
            "name": "mushroom body alpha-lobe",
            "syn": "alpha-lobe of mushroom body",
            "id": "FBbt_00003690"
        }, {
            "name": "mushroom body medial lobe",
            "syn": "FBbt_00005408",
            "id": "FBbt_00005408"
        }, {
            "name": "mushroom body medial lobe",
            "syn": "mushroom body medial lobe",
            "id": "FBbt_00005408"
        }, {
            "name": "mushroom body medial lobe",
            "syn": "horizontal lobe of mushroom body",
            "id": "FBbt_00005408"
        }, {
            "name": "mushroom body medial lobe",
            "syn": "medial lobe of mushroom body",
            "id": "FBbt_00005408"
        }, {
            "name": "mushroom body medial lobe",
            "syn": "medial branch of mushroom body",
            "id": "FBbt_00005408"
        }, {"name": "mushroom body medial lobe", "syn": "ML", "id": "FBbt_00005408"}, {
            "name": "gall",
            "syn": "FBbt_00040060",
            "id": "FBbt_00040060"
        }, {"name": "gall", "syn": "gall", "id": "FBbt_00040060"}, {
            "name": "gall",
            "syn": "GA",
            "id": "FBbt_00040060"
        }, {
            "name": "upper lateral accessory lobe",
            "syn": "FBbt_00040059",
            "id": "FBbt_00040059"
        }, {
            "name": "upper lateral accessory lobe",
            "syn": "upper lateral accessory lobe",
            "id": "FBbt_00040059"
        }, {"name": "upper lateral accessory lobe", "syn": "ULAL", "id": "FBbt_00040059"}, {
            "name": "prow",
            "syn": "FBbt_00040051",
            "id": "FBbt_00040051"
        }, {"name": "prow", "syn": "prow", "id": "FBbt_00040051"}, {
            "name": "prow",
            "syn": "PRW",
            "id": "FBbt_00040051"
        }, {"name": "prow", "syn": "SOG", "id": "FBbt_00040051"}, {
            "name": "inferior bridge",
            "syn": "FBbt_00040050",
            "id": "FBbt_00040050"
        }, {"name": "inferior bridge", "syn": "inferior bridge", "id": "FBbt_00040050"}, {
            "name": "inferior bridge",
            "syn": "IB",
            "id": "FBbt_00040050"
        }, {
            "name": "inferior bridge",
            "syn": "CCP",
            "id": "FBbt_00040050"
        }, {
            "name": "anterior maxillary sensory center",
            "syn": "FBbt_00040057",
            "id": "FBbt_00040057"
        }, {
            "name": "anterior maxillary sensory center",
            "syn": "anterior maxillary sensory center",
            "id": "FBbt_00040057"
        }, {
            "name": "anterior maxillary sensory center",
            "syn": "AMS",
            "id": "FBbt_00040057"
        }, {
            "name": "posterior maxillary sensory center",
            "syn": "FBbt_00040056",
            "id": "FBbt_00040056"
        }, {
            "name": "posterior maxillary sensory center",
            "syn": "posterior maxillary sensory center",
            "id": "FBbt_00040056"
        }, {
            "name": "posterior maxillary sensory center",
            "syn": "PMS",
            "id": "FBbt_00040056"
        }, {
            "name": "labial sensory center",
            "syn": "FBbt_00040055",
            "id": "FBbt_00040055"
        }, {
            "name": "labial sensory center",
            "syn": "labial sensory center",
            "id": "FBbt_00040055"
        }, {"name": "labial sensory center", "syn": "LS", "id": "FBbt_00040055"}, {
            "name": "labial sensory center",
            "syn": "labellar sensory center",
            "id": "FBbt_00040055"
        }, {
            "name": "inferior pharyngeal sensory center",
            "syn": "FBbt_00040054",
            "id": "FBbt_00040054"
        }, {
            "name": "inferior pharyngeal sensory center",
            "syn": "inferior pharyngeal sensory center",
            "id": "FBbt_00040054"
        }, {
            "name": "inferior pharyngeal sensory center",
            "syn": "IPhS",
            "id": "FBbt_00040054"
        }, {
            "name": "inferior pharyngeal sensory center",
            "syn": "ventral pharyngeal sensory center",
            "id": "FBbt_00040054"
        }, {"name": "inferior clamp", "syn": "FBbt_00040049", "id": "FBbt_00040049"}, {
            "name": "inferior clamp",
            "syn": "inferior clamp",
            "id": "FBbt_00040049"
        }, {"name": "inferior clamp", "syn": "ICL", "id": "FBbt_00040049"}, {
            "name": "inferior clamp",
            "syn": "DMP",
            "id": "FBbt_00040049"
        }, {"name": "superior clamp", "syn": "FBbt_00040048", "id": "FBbt_00040048"}, {
            "name": "superior clamp",
            "syn": "superior clamp",
            "id": "FBbt_00040048"
        }, {"name": "superior clamp", "syn": "SCL", "id": "FBbt_00040048"}, {
            "name": "superior clamp",
            "syn": "SPP",
            "id": "FBbt_00040048"
        }, {"name": "clamp", "syn": "FBbt_00040047", "id": "FBbt_00040047"}, {
            "name": "clamp",
            "syn": "clamp",
            "id": "FBbt_00040047"
        }, {"name": "clamp", "syn": "CL", "id": "FBbt_00040047"}, {
            "name": "posterior ventrolateral protocerebrum",
            "syn": "FBbt_00040042",
            "id": "FBbt_00040042"
        }, {
            "name": "posterior ventrolateral protocerebrum",
            "syn": "posterior ventrolateral protocerebrum",
            "id": "FBbt_00040042"
        }, {
            "name": "posterior ventrolateral protocerebrum",
            "syn": "posterior VLP",
            "id": "FBbt_00040042"
        }, {"name": "posterior ventrolateral protocerebrum", "syn": "PVLP", "id": "FBbt_00040042"}, {
            "name": "vest",
            "syn": "FBbt_00040041",
            "id": "FBbt_00040041"
        }, {"name": "vest", "syn": "vest", "id": "FBbt_00040041"}, {
            "name": "vest",
            "syn": "VES",
            "id": "FBbt_00040041"
        }, {"name": "epaulette", "syn": "FBbt_00040040", "id": "FBbt_00040040"}, {
            "name": "epaulette",
            "syn": "epaulette",
            "id": "FBbt_00040040"
        }, {
            "name": "epaulette",
            "syn": "EPA",
            "id": "FBbt_00040040"
        }, {
            "name": "posterior superior lateral protocerebrum",
            "syn": "FBbt_00040046",
            "id": "FBbt_00040046"
        }, {
            "name": "posterior superior lateral protocerebrum",
            "syn": "posterior superior lateral protocerebrum",
            "id": "FBbt_00040046"
        }, {
            "name": "posterior superior lateral protocerebrum",
            "syn": "PSLP",
            "id": "FBbt_00040046"
        }, {
            "name": "posterior superior lateral protocerebrum",
            "syn": "posterior SLP",
            "id": "FBbt_00040046"
        }, {
            "name": "anterior superior lateral protocerebrum",
            "syn": "FBbt_00040045",
            "id": "FBbt_00040045"
        }, {
            "name": "anterior superior lateral protocerebrum",
            "syn": "anterior superior lateral protocerebrum",
            "id": "FBbt_00040045"
        }, {
            "name": "anterior superior lateral protocerebrum",
            "syn": "middle slpr",
            "id": "FBbt_00040045"
        }, {
            "name": "anterior superior lateral protocerebrum",
            "syn": "ASLP",
            "id": "FBbt_00040045"
        }, {
            "name": "anterior superior lateral protocerebrum",
            "syn": "mslpr",
            "id": "FBbt_00040045"
        }, {
            "name": "posterior lateral protocerebrum",
            "syn": "FBbt_00040044",
            "id": "FBbt_00040044"
        }, {
            "name": "posterior lateral protocerebrum",
            "syn": "posterior lateral protocerebrum",
            "id": "FBbt_00040044"
        }, {
            "name": "posterior lateral protocerebrum",
            "syn": "posteriolateral protocerebrum",
            "id": "FBbt_00040044"
        }, {
            "name": "posterior lateral protocerebrum",
            "syn": "PLP",
            "id": "FBbt_00040044"
        }, {
            "name": "posterior lateral protocerebrum",
            "syn": "posterior-lateral protocerebrum",
            "id": "FBbt_00040044"
        }, {
            "name": "posterior lateral protocerebrum",
            "syn": "SPP",
            "id": "FBbt_00040044"
        }, {
            "name": "posterior lateral protocerebrum",
            "syn": "CVLP",
            "id": "FBbt_00040044"
        }, {
            "name": "anterior ventrolateral protocerebrum",
            "syn": "FBbt_00040043",
            "id": "FBbt_00040043"
        }, {
            "name": "anterior ventrolateral protocerebrum",
            "syn": "anterior ventrolateral protocerebrum",
            "id": "FBbt_00040043"
        }, {
            "name": "anterior ventrolateral protocerebrum",
            "syn": "anterior VLP",
            "id": "FBbt_00040043"
        }, {
            "name": "anterior ventrolateral protocerebrum",
            "syn": "AVLP",
            "id": "FBbt_00040043"
        }, {"name": "posterior slope", "syn": "FBbt_00040072", "id": "FBbt_00040072"}, {
            "name": "posterior slope",
            "syn": "posterior slope",
            "id": "FBbt_00040072"
        }, {"name": "posterior slope", "syn": "PS", "id": "FBbt_00040072"}, {
            "name": "posterior slope",
            "syn": "CMP",
            "id": "FBbt_00040072"
        }, {"name": "ventral complex", "syn": "FBbt_00040071", "id": "FBbt_00040071"}, {
            "name": "ventral complex",
            "syn": "ventral complex",
            "id": "FBbt_00040071"
        }, {"name": "ventral complex", "syn": "VX", "id": "FBbt_00040071"}, {
            "name": "ventral complex",
            "syn": "VMP",
            "id": "FBbt_00040071"
        }, {
            "name": "ventral complex",
            "syn": "PAN",
            "id": "FBbt_00040071"
        }, {
            "name": "posterior superior medial protocerebrum",
            "syn": "FBbt_00040063",
            "id": "FBbt_00040063"
        }, {
            "name": "posterior superior medial protocerebrum",
            "syn": "posterior superior medial protocerebrum",
            "id": "FBbt_00040063"
        }, {
            "name": "posterior superior medial protocerebrum",
            "syn": "PSMP",
            "id": "FBbt_00040063"
        }, {
            "name": "posterior superior medial protocerebrum",
            "syn": "posterior SMP",
            "id": "FBbt_00040063"
        }, {
            "name": "anterior superior medial protocerebrum",
            "syn": "FBbt_00040062",
            "id": "FBbt_00040062"
        }, {
            "name": "anterior superior medial protocerebrum",
            "syn": "anterior superior medial protocerebrum",
            "id": "FBbt_00040062"
        }, {
            "name": "anterior superior medial protocerebrum",
            "syn": "anterior SMP",
            "id": "FBbt_00040062"
        }, {
            "name": "anterior superior medial protocerebrum",
            "syn": "ASMP",
            "id": "FBbt_00040062"
        }, {
            "name": "lower lateral accessory lobe",
            "syn": "FBbt_00040061",
            "id": "FBbt_00040061"
        }, {
            "name": "lower lateral accessory lobe",
            "syn": "lower lateral accessory lobe",
            "id": "FBbt_00040061"
        }, {"name": "lower lateral accessory lobe", "syn": "LLAL", "id": "FBbt_00040061"}, {
            "name": "lobula",
            "syn": "FBbt_00003852",
            "id": "FBbt_00003852"
        }, {"name": "lobula", "syn": "lobula", "id": "FBbt_00003852"}, {
            "name": "lobula",
            "syn": "LO",
            "id": "FBbt_00003852"
        }, {"name": "lobula", "syn": "Lob", "id": "FBbt_00003852"}, {
            "name": "lobula plate",
            "syn": "FBbt_00003885",
            "id": "FBbt_00003885"
        }, {"name": "lobula plate", "syn": "lobula plate", "id": "FBbt_00003885"}, {
            "name": "lobula plate",
            "syn": "lobula plate neuropil",
            "id": "FBbt_00003885"
        }, {"name": "lobula plate", "syn": "LoP", "id": "FBbt_00003885"}, {
            "name": "lobula plate",
            "syn": "LOP",
            "id": "FBbt_00003885"
        }, {
            "name": "adult gnathal ganglion",
            "syn": "FBbt_00014013",
            "id": "FBbt_00014013"
        }, {
            "name": "adult gnathal ganglion",
            "syn": "adult gnathal ganglion",
            "id": "FBbt_00014013"
        }, {"name": "adult gnathal ganglion", "syn": "GNG", "id": "FBbt_00014013"}, {
            "name": "adult gnathal ganglion",
            "syn": "SOG",
            "id": "FBbt_00014013"
        }, {
            "name": "vertical lobe of adult mushroom body",
            "syn": "FBbt_00015407",
            "id": "FBbt_00015407"
        }, {
            "name": "vertical lobe of adult mushroom body",
            "syn": "vertical lobe of adult mushroom body",
            "id": "FBbt_00015407"
        }, {
            "name": "vertical lobe of adult mushroom body",
            "syn": "vertical branch of adult mushroom body",
            "id": "FBbt_00015407"
        }, {
            "name": "vertical lobe of adult mushroom body",
            "syn": "adult dorsal lobe",
            "id": "FBbt_00015407"
        }, {
            "name": "vertical lobe of adult mushroom body",
            "syn": "dorsal lobe of adult mushroom body",
            "id": "FBbt_00015407"
        }, {"name": "lamina", "syn": "FBbt_00003708", "id": "FBbt_00003708"}, {
            "name": "lamina",
            "syn": "lamina",
            "id": "FBbt_00003708"
        }, {"name": "lamina", "syn": "LA", "id": "FBbt_00003708"}, {
            "name": "outer medulla",
            "syn": "FBbt_00003749",
            "id": "FBbt_00003749"
        }, {"name": "outer medulla", "syn": "outer medulla", "id": "FBbt_00003749"}, {
            "name": "inner medulla",
            "syn": "FBbt_00003757",
            "id": "FBbt_00003757"
        }, {"name": "inner medulla", "syn": "inner medulla", "id": "FBbt_00003757"}, {
            "name": "inner medulla",
            "syn": "MEI",
            "id": "FBbt_00003757"
        }, {"name": "serpentine layer", "syn": "FBbt_00003756", "id": "FBbt_00003756"}, {
            "name": "serpentine layer",
            "syn": "serpentine layer",
            "id": "FBbt_00003756"
        }, {"name": "serpentine layer", "syn": "medulla layer 7", "id": "FBbt_00003756"}, {
            "name": "serpentine layer",
            "syn": "SPL",
            "id": "FBbt_00003756"
        }, {"name": "gorget", "syn": "FBbt_00040039", "id": "FBbt_00040039"}, {
            "name": "gorget",
            "syn": "gorget",
            "id": "FBbt_00040039"
        }, {"name": "gorget", "syn": "GOR", "id": "FBbt_00040039"}, {
            "name": "rubus",
            "syn": "FBbt_00040038",
            "id": "FBbt_00040038"
        }, {"name": "rubus", "syn": "rubus", "id": "FBbt_00040038"}, {
            "name": "rubus",
            "syn": "RUB",
            "id": "FBbt_00040038"
        }, {"name": "nodulus subunit", "syn": "FBbt_00040033", "id": "FBbt_00040033"}, {
            "name": "nodulus subunit",
            "syn": "nodulus subunit",
            "id": "FBbt_00040033"
        }, {
            "name": "adult antennal lobe",
            "syn": "FBbt_00007401",
            "id": "FBbt_00007401"
        }, {
            "name": "adult antennal lobe",
            "syn": "adult antennal lobe",
            "id": "FBbt_00007401"
        }, {
            "name": "adult antennal lobe",
            "syn": "adult olfactory lobe",
            "id": "FBbt_00007401"
        }, {"name": "adult antennal lobe", "syn": "AL", "id": "FBbt_00007401"}, {
            "name": "mushroom body spur",
            "syn": "FBbt_00045010",
            "id": "FBbt_00045010"
        }, {
            "name": "mushroom body spur",
            "syn": "mushroom body spur",
            "id": "FBbt_00045010"
        }, {
            "name": "mushroom body spur",
            "syn": "heel of mushroom body",
            "id": "FBbt_00045010"
        }, {"name": "mushroom body spur", "syn": "SPU", "id": "FBbt_00045010"}, {
            "name": "mushroom body spur",
            "syn": "mushroom body heel",
            "id": "FBbt_00045010"
        }, {
            "name": "pedunculus neck of adult mushroom body",
            "syn": "FBbt_00045008",
            "id": "FBbt_00045008"
        }, {
            "name": "pedunculus neck of adult mushroom body",
            "syn": "pedunculus neck of adult mushroom body",
            "id": "FBbt_00045008"
        }, {
            "name": "pedunculus neck of adult mushroom body",
            "syn": "pedunculus neck",
            "id": "FBbt_00045008"
        }, {
            "name": "pedunculus neck of adult mushroom body",
            "syn": "PEDN",
            "id": "FBbt_00045008"
        }, {
            "name": "pedunculus divide of adult mushroom body",
            "syn": "FBbt_00045009",
            "id": "FBbt_00045009"
        }, {
            "name": "pedunculus divide of adult mushroom body",
            "syn": "pedunculus divide of adult mushroom body",
            "id": "FBbt_00045009"
        }, {
            "name": "pedunculus divide of adult mushroom body",
            "syn": "PEDD",
            "id": "FBbt_00045009"
        }, {
            "name": "pedunculus divide of adult mushroom body",
            "syn": "knee",
            "id": "FBbt_00045009"
        }, {
            "name": "pedunculus divide of adult mushroom body",
            "syn": "pedunculus divide",
            "id": "FBbt_00045009"
        }, {
            "name": "pedunculus divide of adult mushroom body",
            "syn": "heel",
            "id": "FBbt_00045009"
        }, {
            "name": "pedunculus divide of adult mushroom body",
            "syn": "lobe junction",
            "id": "FBbt_00045009"
        }, {
            "name": "mushroom body lateral calyx",
            "syn": "FBbt_00045006",
            "id": "FBbt_00045006"
        }, {
            "name": "mushroom body lateral calyx",
            "syn": "mushroom body lateral calyx",
            "id": "FBbt_00045006"
        }, {
            "name": "mushroom body lateral calyx",
            "syn": "LCA",
            "id": "FBbt_00045006"
        }, {
            "name": "mushroom body accessory calyx",
            "syn": "FBbt_00045007",
            "id": "FBbt_00045007"
        }, {
            "name": "mushroom body accessory calyx",
            "syn": "mushroom body accessory calyx",
            "id": "FBbt_00045007"
        }, {
            "name": "mushroom body accessory calyx",
            "syn": "dorsal accessory calyx",
            "id": "FBbt_00045007"
        }, {"name": "mushroom body accessory calyx", "syn": "ACA", "id": "FBbt_00045007"}, {
            "name": "lobula complex",
            "syn": "FBbt_00045004",
            "id": "FBbt_00045004"
        }, {"name": "lobula complex", "syn": "lobula complex", "id": "FBbt_00045004"}, {
            "name": "lobula complex",
            "syn": "LOX",
            "id": "FBbt_00045004"
        }, {
            "name": "mushroom body medial calyx",
            "syn": "FBbt_00045005",
            "id": "FBbt_00045005"
        }, {
            "name": "mushroom body medial calyx",
            "syn": "mushroom body medial calyx",
            "id": "FBbt_00045005"
        }, {
            "name": "mushroom body medial calyx",
            "syn": "MCA",
            "id": "FBbt_00045005"
        }, {
            "name": "medulla dorsal rim area",
            "syn": "FBbt_00045002",
            "id": "FBbt_00045002"
        }, {
            "name": "medulla dorsal rim area",
            "syn": "medulla dorsal rim area",
            "id": "FBbt_00045002"
        }, {
            "name": "medulla dorsal rim area",
            "syn": "dorsal rim area of medulla",
            "id": "FBbt_00045002"
        }, {
            "name": "medulla dorsal rim area",
            "syn": "MEDRA",
            "id": "FBbt_00045002"
        }, {
            "name": "lamina dorsal rim area",
            "syn": "FBbt_00045000",
            "id": "FBbt_00045000"
        }, {
            "name": "lamina dorsal rim area",
            "syn": "lamina dorsal rim area",
            "id": "FBbt_00045000"
        }, {"name": "lamina dorsal rim area", "syn": "LADRA", "id": "FBbt_00045000"}, {
            "name": "plexiform medulla",
            "syn": "FBbt_00045001",
            "id": "FBbt_00045001"
        }, {
            "name": "plexiform medulla",
            "syn": "plexiform medulla",
            "id": "FBbt_00045001"
        }, {"name": "plexiform medulla", "syn": "medulla proper", "id": "FBbt_00045001"}, {
            "name": "plexiform medulla",
            "syn": "PLME",
            "id": "FBbt_00045001"
        }, {"name": "plexiform medulla", "syn": "MEP", "id": "FBbt_00045001"}, {
            "name": "wedge",
            "syn": "FBbt_00045027",
            "id": "FBbt_00045027"
        }, {"name": "wedge", "syn": "wedge", "id": "FBbt_00045027"}, {
            "name": "wedge",
            "syn": "inferior VLP",
            "id": "FBbt_00045027"
        }, {"name": "wedge", "syn": "IVLP", "id": "FBbt_00045027"}, {
            "name": "wedge",
            "syn": "inferior ventrolateral protocerebrum",
            "id": "FBbt_00045027"
        }, {"name": "wedge", "syn": "WED", "id": "FBbt_00045027"}, {
            "name": "mushroom body medial lobelet",
            "syn": "FBbt_00045018",
            "id": "FBbt_00045018"
        }, {
            "name": "mushroom body medial lobelet",
            "syn": "mushroom body medial lobelet",
            "id": "FBbt_00045018"
        }, {
            "name": "mushroom body medial lobelet",
            "syn": "mushroom body beta accessory calyx fibers",
            "id": "FBbt_00045018"
        }, {
            "name": "mushroom body vertical lobelet",
            "syn": "FBbt_00045014",
            "id": "FBbt_00045014"
        }, {
            "name": "mushroom body vertical lobelet",
            "syn": "mushroom body vertical lobelet",
            "id": "FBbt_00045014"
        }, {
            "name": "mushroom body vertical lobelet",
            "syn": "mushroom body alpha accessory calyx fibers",
            "id": "FBbt_00045014"
        }, {"name": "cantle", "syn": "FBbt_00045051", "id": "FBbt_00045051"}, {
            "name": "cantle",
            "syn": "cantle",
            "id": "FBbt_00045051"
        }, {"name": "cantle", "syn": "CAN", "id": "FBbt_00045051"}, {
            "name": "cantle",
            "syn": "PONPp",
            "id": "FBbt_00045051"
        }, {"name": "cantle", "syn": "posterior perioesophageal neuropil", "id": "FBbt_00045051"}, {
            "name": "cantle",
            "syn": "VMP",
            "id": "FBbt_00045051"
        }, {"name": "flange", "syn": "FBbt_00045050", "id": "FBbt_00045050"}, {
            "name": "flange",
            "syn": "flange",
            "id": "FBbt_00045050"
        }, {"name": "flange", "syn": "FLA", "id": "FBbt_00045050"}, {
            "name": "flange",
            "syn": "SOG",
            "id": "FBbt_00045050"
        }, {
            "name": "inferior posterior slope",
            "syn": "FBbt_00045046",
            "id": "FBbt_00045046"
        }, {
            "name": "inferior posterior slope",
            "syn": "inferior posterior slope",
            "id": "FBbt_00045046"
        }, {
            "name": "inferior posterior slope",
            "syn": "IPS",
            "id": "FBbt_00045046"
        }, {
            "name": "superior posterior slope",
            "syn": "FBbt_00045040",
            "id": "FBbt_00045040"
        }, {
            "name": "superior posterior slope",
            "syn": "superior posterior slope",
            "id": "FBbt_00045040"
        }, {"name": "superior posterior slope", "syn": "SPS", "id": "FBbt_00045040"}, {
            "name": "crepine",
            "syn": "FBbt_00045037",
            "id": "FBbt_00045037"
        }, {"name": "crepine", "syn": "crepine", "id": "FBbt_00045037"}, {
            "name": "crepine",
            "syn": "CRE",
            "id": "FBbt_00045037"
        }, {"name": "crepine", "syn": "IDFP", "id": "FBbt_00045037"}, {
            "name": "adult mushroom body beta-lobe",
            "syn": "FBbt_00110658",
            "id": "FBbt_00110658"
        }, {
            "name": "adult mushroom body beta-lobe",
            "syn": "adult mushroom body beta-lobe",
            "id": "FBbt_00110658"
        }, {
            "name": "adult mushroom body beta-lobe",
            "syn": "beta-lobe of adult  mushroom body",
            "id": "FBbt_00110658"
        }, {
            "name": "adult mushroom body beta-lobe",
            "syn": "adult beta-lobe",
            "id": "FBbt_00110658"
        }, {
            "name": "adult mushroom body alpha-lobe",
            "syn": "FBbt_00110657",
            "id": "FBbt_00110657"
        }, {
            "name": "adult mushroom body alpha-lobe",
            "syn": "adult mushroom body alpha-lobe",
            "id": "FBbt_00110657"
        }, {
            "name": "adult mushroom body alpha-lobe",
            "syn": "alpha-lobe of adult  mushroom body",
            "id": "FBbt_00110657"
        }, {
            "name": "adult mushroom body alpha-lobe",
            "syn": "adult alpha-lobe",
            "id": "FBbt_00110657"
        }, {
            "name": "adult supraesophageal zone",
            "syn": "FBbt_00110638",
            "id": "FBbt_00110638"
        }, {
            "name": "adult supraesophageal zone",
            "syn": "adult supraesophageal zone",
            "id": "FBbt_00110638"
        }, {
            "name": "adult supraesophageal zone",
            "syn": "SPZ",
            "id": "FBbt_00110638"
        }, {
            "name": "adult supraesophageal zone",
            "syn": "supraesophageal ganglion",
            "id": "FBbt_00110638"
        }, {
            "name": "adult subesophageal zone",
            "syn": "FBbt_00110639",
            "id": "FBbt_00110639"
        }, {
            "name": "adult subesophageal zone",
            "syn": "adult subesophageal zone",
            "id": "FBbt_00110639"
        }, {
            "name": "adult subesophageal zone",
            "syn": "suboesophageal ganglion",
            "id": "FBbt_00110639"
        }, {
            "name": "adult subesophageal zone",
            "syn": "subesophageal ganglion",
            "id": "FBbt_00110639"
        }, {
            "name": "adult subesophageal zone",
            "syn": "SEG",
            "id": "FBbt_00110639"
        }, {
            "name": "adult subesophageal zone",
            "syn": "SEZ",
            "id": "FBbt_00110639"
        }, {
            "name": "adult subesophageal zone",
            "syn": "SOG",
            "id": "FBbt_00110639"
        }, {
            "name": "adult cerebral ganglion",
            "syn": "FBbt_00110636",
            "id": "FBbt_00110636"
        }, {
            "name": "adult cerebral ganglion",
            "syn": "adult cerebral ganglion",
            "id": "FBbt_00110636"
        }, {
            "name": "adult cerebral ganglion",
            "syn": "CRG",
            "id": "FBbt_00110636"
        }, {
            "name": "embryonic/larval supraesophageal ganglion",
            "syn": "FBbt_00110637",
            "id": "FBbt_00110637"
        }, {
            "name": "embryonic/larval supraesophageal ganglion",
            "syn": "embryonic/larval supraesophageal ganglion",
            "id": "FBbt_00110637"
        }, {
            "name": "embryonic/larval supraesophageal ganglion",
            "syn": "embryonic SPG",
            "id": "FBbt_00110637"
        }, {
            "name": "embryonic/larval supraesophageal ganglion",
            "syn": "SPG",
            "id": "FBbt_00110637"
        }, {
            "name": "embryonic/larval supraesophageal ganglion",
            "syn": "supraesophageal ganglion",
            "id": "FBbt_00110637"
        }, {
            "name": "spur of adult mushroom body",
            "syn": "FBbt_00110640",
            "id": "FBbt_00110640"
        }, {
            "name": "spur of adult mushroom body",
            "syn": "spur of adult mushroom body",
            "id": "FBbt_00110640"
        }, {
            "name": "spur of adult mushroom body",
            "syn": "heel of mushroom body",
            "id": "FBbt_00110640"
        }, {
            "name": "spur of adult mushroom body",
            "syn": "SPU",
            "id": "FBbt_00110640"
        }, {
            "name": "spur of adult mushroom body",
            "syn": "mushroom body heel",
            "id": "FBbt_00110640"
        }, {"name": "spur of adult mushroom body", "syn": "spur", "id": "FBbt_00110640"}, {
            "name": "lamina plexus",
            "syn": "FBbt_00001943",
            "id": "FBbt_00001943"
        }, {"name": "lamina plexus", "syn": "lamina plexus", "id": "FBbt_00001943"}, {
            "name": "lamina plexus",
            "syn": "lamina plexiform layer",
            "id": "FBbt_00001943"
        }, {
            "name": "adult mushroom body alpha'-lobe",
            "syn": "FBbt_00013691",
            "id": "FBbt_00013691"
        }, {
            "name": "adult mushroom body alpha'-lobe",
            "syn": "adult mushroom body alpha'-lobe",
            "id": "FBbt_00013691"
        }, {
            "name": "adult mushroom body alpha'-lobe",
            "syn": "alpha'-lobe of adult  mushroom body",
            "id": "FBbt_00013691"
        }, {
            "name": "adult mushroom body alpha'-lobe",
            "syn": "adult alpha'-lobe",
            "id": "FBbt_00013691"
        }, {
            "name": "lobe system of adult mushroom body",
            "syn": "FBbt_00013688",
            "id": "FBbt_00013688"
        }, {
            "name": "lobe system of adult mushroom body",
            "syn": "lobe system of adult mushroom body",
            "id": "FBbt_00013688"
        }, {
            "name": "adult mushroom body gamma-lobe",
            "syn": "FBbt_00013695",
            "id": "FBbt_00013695"
        }, {
            "name": "adult mushroom body gamma-lobe",
            "syn": "adult mushroom body gamma-lobe",
            "id": "FBbt_00013695"
        }, {
            "name": "adult mushroom body gamma-lobe",
            "syn": "gamma-lobe of adult mushroom body",
            "id": "FBbt_00013695"
        }, {
            "name": "adult mushroom body gamma-lobe",
            "syn": "gamma L",
            "id": "FBbt_00013695"
        }, {
            "name": "adult mushroom body beta'-lobe",
            "syn": "FBbt_00013694",
            "id": "FBbt_00013694"
        }, {
            "name": "adult mushroom body beta'-lobe",
            "syn": "adult mushroom body beta'-lobe",
            "id": "FBbt_00013694"
        }, {
            "name": "adult mushroom body beta'-lobe",
            "syn": "beta'-lobe",
            "id": "FBbt_00013694"
        }, {
            "name": "adult mushroom body beta'-lobe",
            "syn": "beta'-lobe of mushroom body",
            "id": "FBbt_00013694"
        }, {"name": "bulb", "syn": "FBbt_00003682", "id": "FBbt_00003682"}, {
            "name": "bulb",
            "syn": "bulb",
            "id": "FBbt_00003682"
        }, {"name": "bulb", "syn": "lateral triangle", "id": "FBbt_00003682"}, {
            "name": "bulb",
            "syn": "isthmus",
            "id": "FBbt_00003682"
        }, {"name": "bulb", "syn": "BU", "id": "FBbt_00003682"}, {
            "name": "bulb",
            "syn": "Lat Tri",
            "id": "FBbt_00003682"
        }, {
            "name": "mushroom body calyx",
            "syn": "FBbt_00003685",
            "id": "FBbt_00003685"
        }, {
            "name": "mushroom body calyx",
            "syn": "mushroom body calyx",
            "id": "FBbt_00003685"
        }, {
            "name": "mushroom body calyx",
            "syn": "calyx of corpora pedunculata",
            "id": "FBbt_00003685"
        }, {"name": "mushroom body calyx", "syn": "CA", "id": "FBbt_00003685"}, {
            "name": "mushroom body calyx",
            "syn": "calyx of mushroom body",
            "id": "FBbt_00003685"
        }, {"name": "mushroom body", "syn": "FBbt_00005801", "id": "FBbt_00005801"}, {
            "name": "mushroom body",
            "syn": "mushroom body",
            "id": "FBbt_00005801"
        }, {"name": "mushroom body", "syn": "corpora pedunculata", "id": "FBbt_00005801"}, {
            "name": "optic lobe",
            "syn": "FBbt_00003701",
            "id": "FBbt_00003701"
        }, {"name": "optic lobe", "syn": "optic lobe", "id": "FBbt_00003701"}, {
            "name": "optic lobe",
            "syn": "OL",
            "id": "FBbt_00003701"
        }, {"name": "medulla", "syn": "FBbt_00003748", "id": "FBbt_00003748"}, {
            "name": "medulla",
            "syn": "medulla",
            "id": "FBbt_00003748"
        }, {"name": "medulla", "syn": "ME", "id": "FBbt_00003748"}, {
            "name": "medulla",
            "syn": "optic medulla",
            "id": "FBbt_00003748"
        }, {"name": "medulla", "syn": "Med", "id": "FBbt_00003748"}, {
            "name": "abdominal 1 vesB neuron",
            "syn": "FBbt_00002477",
            "id": "FBbt_00002477"
        }, {
            "name": "abdominal 1 vesB neuron",
            "syn": "abdominal 1 vesB neuron",
            "id": "FBbt_00002477"
        }, {
            "name": "dorsal thoracic da5",
            "syn": "FBbt_00001146",
            "id": "FBbt_00001146"
        }, {
            "name": "dorsal thoracic da5",
            "syn": "dorsal thoracic da5",
            "id": "FBbt_00001146"
        }, {
            "name": "abdominal 5 vesB neuron",
            "syn": "FBbt_00002481",
            "id": "FBbt_00002481"
        }, {
            "name": "abdominal 5 vesB neuron",
            "syn": "abdominal 5 vesB neuron",
            "id": "FBbt_00002481"
        }, {
            "name": "dorsal thoracic es3",
            "syn": "FBbt_00001150",
            "id": "FBbt_00001150"
        }, {
            "name": "dorsal thoracic es3",
            "syn": "dorsal thoracic es3",
            "id": "FBbt_00001150"
        }, {
            "name": "abdominal 6 vesB neuron",
            "syn": "FBbt_00002482",
            "id": "FBbt_00002482"
        }, {
            "name": "abdominal 6 vesB neuron",
            "syn": "abdominal 6 vesB neuron",
            "id": "FBbt_00002482"
        }, {
            "name": "dorsal thoracic es4",
            "syn": "FBbt_00001151",
            "id": "FBbt_00001151"
        }, {
            "name": "dorsal thoracic es4",
            "syn": "dorsal thoracic es4",
            "id": "FBbt_00001151"
        }, {
            "name": "abdominal 7 vesB neuron",
            "syn": "FBbt_00002483",
            "id": "FBbt_00002483"
        }, {
            "name": "abdominal 7 vesB neuron",
            "syn": "abdominal 7 vesB neuron",
            "id": "FBbt_00002483"
        }, {
            "name": "dorsal thoracic es5",
            "syn": "FBbt_00001152",
            "id": "FBbt_00001152"
        }, {
            "name": "dorsal thoracic es5",
            "syn": "dorsal thoracic es5",
            "id": "FBbt_00001152"
        }, {
            "name": "abdominal vesC neuron",
            "syn": "FBbt_00002484",
            "id": "FBbt_00002484"
        }, {
            "name": "abdominal vesC neuron",
            "syn": "abdominal vesC neuron",
            "id": "FBbt_00002484"
        }, {"name": "abdominal vesC neuron", "syn": "p3", "id": "FBbt_00002484"}, {
            "name": "abdominal vesC neuron",
            "syn": "vc3",
            "id": "FBbt_00002484"
        }, {"name": "abdominal vesC neuron", "syn": "vp3", "id": "FBbt_00002484"}, {
            "name": "dorsal thoracic bd1",
            "syn": "FBbt_00001153",
            "id": "FBbt_00001153"
        }, {
            "name": "dorsal thoracic bd1",
            "syn": "dorsal thoracic bd1",
            "id": "FBbt_00001153"
        }, {
            "name": "abdominal 4 vesB neuron",
            "syn": "FBbt_00002480",
            "id": "FBbt_00002480"
        }, {
            "name": "abdominal 4 vesB neuron",
            "syn": "abdominal 4 vesB neuron",
            "id": "FBbt_00002480"
        }, {
            "name": "abdominal 5 vesC neuron",
            "syn": "FBbt_00002489",
            "id": "FBbt_00002489"
        }, {
            "name": "abdominal 5 vesC neuron",
            "syn": "abdominal 5 vesC neuron",
            "id": "FBbt_00002489"
        }, {
            "name": "lateral thoracic cluster",
            "syn": "FBbt_00001158",
            "id": "FBbt_00001158"
        }, {
            "name": "lateral thoracic cluster",
            "syn": "lateral thoracic cluster",
            "id": "FBbt_00001158"
        }, {
            "name": "lateral thoracic da",
            "syn": "FBbt_00001159",
            "id": "FBbt_00001159"
        }, {
            "name": "lateral thoracic da",
            "syn": "lateral thoracic da",
            "id": "FBbt_00001159"
        }, {
            "name": "abdominal 1 vesC neuron",
            "syn": "FBbt_00002485",
            "id": "FBbt_00002485"
        }, {
            "name": "abdominal 1 vesC neuron",
            "syn": "abdominal 1 vesC neuron",
            "id": "FBbt_00002485"
        }, {"name": "dorsal thoracic ch", "syn": "FBbt_00001154", "id": "FBbt_00001154"}, {
            "name": "dorsal thoracic ch",
            "syn": "dorsal thoracic ch",
            "id": "FBbt_00001154"
        }, {
            "name": "abdominal 2 vesC neuron",
            "syn": "FBbt_00002486",
            "id": "FBbt_00002486"
        }, {
            "name": "abdominal 2 vesC neuron",
            "syn": "abdominal 2 vesC neuron",
            "id": "FBbt_00002486"
        }, {
            "name": "dorsal thoracic ch1",
            "syn": "FBbt_00001155",
            "id": "FBbt_00001155"
        }, {
            "name": "dorsal thoracic ch1",
            "syn": "dorsal thoracic ch1",
            "id": "FBbt_00001155"
        }, {
            "name": "abdominal 3 vesC neuron",
            "syn": "FBbt_00002487",
            "id": "FBbt_00002487"
        }, {
            "name": "abdominal 3 vesC neuron",
            "syn": "abdominal 3 vesC neuron",
            "id": "FBbt_00002487"
        }, {
            "name": "dorsal thoracic ch2",
            "syn": "FBbt_00001156",
            "id": "FBbt_00001156"
        }, {
            "name": "dorsal thoracic ch2",
            "syn": "dorsal thoracic ch2",
            "id": "FBbt_00001156"
        }, {
            "name": "abdominal 4 vesC neuron",
            "syn": "FBbt_00002488",
            "id": "FBbt_00002488"
        }, {
            "name": "abdominal 4 vesC neuron",
            "syn": "abdominal 4 vesC neuron",
            "id": "FBbt_00002488"
        }, {
            "name": "dorsal thoracic ch3",
            "syn": "FBbt_00001157",
            "id": "FBbt_00001157"
        }, {
            "name": "dorsal thoracic ch3",
            "syn": "dorsal thoracic ch3",
            "id": "FBbt_00001157"
        }, {"name": "salivary canal", "syn": "FBbt_00013136", "id": "FBbt_00013136"}, {
            "name": "salivary canal",
            "syn": "salivary canal",
            "id": "FBbt_00013136"
        }, {
            "name": "adult salivary gland proper",
            "syn": "FBbt_00013137",
            "id": "FBbt_00013137"
        }, {
            "name": "adult salivary gland proper",
            "syn": "adult salivary gland proper",
            "id": "FBbt_00013137"
        }, {
            "name": "abdominal v'esA neuron",
            "syn": "FBbt_00002492",
            "id": "FBbt_00002492"
        }, {
            "name": "abdominal v'esA neuron",
            "syn": "abdominal v'esA neuron",
            "id": "FBbt_00002492"
        }, {"name": "abdominal v'esA neuron", "syn": "p4", "id": "FBbt_00002492"}, {
            "name": "abdominal v'esA neuron",
            "syn": "vc4",
            "id": "FBbt_00002492"
        }, {"name": "abdominal v'esA neuron", "syn": "vp4", "id": "FBbt_00002492"}, {
            "name": "lateral thoracic da2",
            "syn": "FBbt_00001161",
            "id": "FBbt_00001161"
        }, {
            "name": "lateral thoracic da2",
            "syn": "lateral thoracic da2",
            "id": "FBbt_00001161"
        }, {
            "name": "abdominal 1 v'esA neuron",
            "syn": "FBbt_00002493",
            "id": "FBbt_00002493"
        }, {
            "name": "abdominal 1 v'esA neuron",
            "syn": "abdominal 1 v'esA neuron",
            "id": "FBbt_00002493"
        }, {
            "name": "lateral thoracic da3",
            "syn": "FBbt_00001162",
            "id": "FBbt_00001162"
        }, {
            "name": "lateral thoracic da3",
            "syn": "lateral thoracic da3",
            "id": "FBbt_00001162"
        }, {
            "name": "abdominal 2 v'esA neuron",
            "syn": "FBbt_00002494",
            "id": "FBbt_00002494"
        }, {
            "name": "abdominal 2 v'esA neuron",
            "syn": "abdominal 2 v'esA neuron",
            "id": "FBbt_00002494"
        }, {
            "name": "lateral thoracic da4",
            "syn": "FBbt_00001163",
            "id": "FBbt_00001163"
        }, {
            "name": "lateral thoracic da4",
            "syn": "lateral thoracic da4",
            "id": "FBbt_00001163"
        }, {
            "name": "abdominal 3 v'esA neuron",
            "syn": "FBbt_00002495",
            "id": "FBbt_00002495"
        }, {
            "name": "abdominal 3 v'esA neuron",
            "syn": "abdominal 3 v'esA neuron",
            "id": "FBbt_00002495"
        }, {
            "name": "lateral thoracic es",
            "syn": "FBbt_00001164",
            "id": "FBbt_00001164"
        }, {
            "name": "lateral thoracic es",
            "syn": "lateral thoracic es",
            "id": "FBbt_00001164"
        }, {
            "name": "abdominal 6 vesC neuron",
            "syn": "FBbt_00002490",
            "id": "FBbt_00002490"
        }, {
            "name": "abdominal 6 vesC neuron",
            "syn": "abdominal 6 vesC neuron",
            "id": "FBbt_00002490"
        }, {
            "name": "abdominal 7 vesC neuron",
            "syn": "FBbt_00002491",
            "id": "FBbt_00002491"
        }, {
            "name": "abdominal 7 vesC neuron",
            "syn": "abdominal 7 vesC neuron",
            "id": "FBbt_00002491"
        }, {
            "name": "lateral thoracic da1",
            "syn": "FBbt_00001160",
            "id": "FBbt_00001160"
        }, {
            "name": "lateral thoracic da1",
            "syn": "lateral thoracic da1",
            "id": "FBbt_00001160"
        }, {
            "name": "lateral thoracic es5",
            "syn": "FBbt_00001169",
            "id": "FBbt_00001169"
        }, {
            "name": "lateral thoracic es5",
            "syn": "lateral thoracic es5",
            "id": "FBbt_00001169"
        }, {
            "name": "abdominal 4 v'esA neuron",
            "syn": "FBbt_00002496",
            "id": "FBbt_00002496"
        }, {
            "name": "abdominal 4 v'esA neuron",
            "syn": "abdominal 4 v'esA neuron",
            "id": "FBbt_00002496"
        }, {
            "name": "lateral thoracic es1",
            "syn": "FBbt_00001165",
            "id": "FBbt_00001165"
        }, {
            "name": "lateral thoracic es1",
            "syn": "lateral thoracic es1",
            "id": "FBbt_00001165"
        }, {
            "name": "abdominal 5 v'esA neuron",
            "syn": "FBbt_00002497",
            "id": "FBbt_00002497"
        }, {
            "name": "abdominal 5 v'esA neuron",
            "syn": "abdominal 5 v'esA neuron",
            "id": "FBbt_00002497"
        }, {
            "name": "lateral thoracic es2",
            "syn": "FBbt_00001166",
            "id": "FBbt_00001166"
        }, {
            "name": "lateral thoracic es2",
            "syn": "lateral thoracic es2",
            "id": "FBbt_00001166"
        }, {
            "name": "abdominal 6 v'esA neuron",
            "syn": "FBbt_00002498",
            "id": "FBbt_00002498"
        }, {
            "name": "abdominal 6 v'esA neuron",
            "syn": "abdominal 6 v'esA neuron",
            "id": "FBbt_00002498"
        }, {
            "name": "lateral thoracic es3",
            "syn": "FBbt_00001167",
            "id": "FBbt_00001167"
        }, {
            "name": "lateral thoracic es3",
            "syn": "lateral thoracic es3",
            "id": "FBbt_00001167"
        }, {
            "name": "abdominal 7 v'esA neuron",
            "syn": "FBbt_00002499",
            "id": "FBbt_00002499"
        }, {
            "name": "abdominal 7 v'esA neuron",
            "syn": "abdominal 7 v'esA neuron",
            "id": "FBbt_00002499"
        }, {
            "name": "lateral thoracic es4",
            "syn": "FBbt_00001168",
            "id": "FBbt_00001168"
        }, {
            "name": "lateral thoracic es4",
            "syn": "lateral thoracic es4",
            "id": "FBbt_00001168"
        }, {
            "name": "ventral thoracic cluster",
            "syn": "FBbt_00001172",
            "id": "FBbt_00001172"
        }, {
            "name": "ventral thoracic cluster",
            "syn": "ventral thoracic cluster",
            "id": "FBbt_00001172"
        }, {
            "name": "ventral thoracic da",
            "syn": "FBbt_00001173",
            "id": "FBbt_00001173"
        }, {
            "name": "ventral thoracic da",
            "syn": "ventral thoracic da",
            "id": "FBbt_00001173"
        }, {
            "name": "ventral thoracic da1",
            "syn": "FBbt_00001174",
            "id": "FBbt_00001174"
        }, {
            "name": "ventral thoracic da1",
            "syn": "ventral thoracic da1",
            "id": "FBbt_00001174"
        }, {
            "name": "ventral thoracic da2",
            "syn": "FBbt_00001175",
            "id": "FBbt_00001175"
        }, {
            "name": "ventral thoracic da2",
            "syn": "ventral thoracic da2",
            "id": "FBbt_00001175"
        }, {
            "name": "lateral thoracic es6",
            "syn": "FBbt_00001170",
            "id": "FBbt_00001170"
        }, {
            "name": "lateral thoracic es6",
            "syn": "lateral thoracic es6",
            "id": "FBbt_00001170"
        }, {
            "name": "lateral thoracic td1",
            "syn": "FBbt_00001171",
            "id": "FBbt_00001171"
        }, {
            "name": "lateral thoracic td1",
            "syn": "lateral thoracic td1",
            "id": "FBbt_00001171"
        }, {"name": "neuroblast VLPl1", "syn": "FBbt_00050103", "id": "FBbt_00050103"}, {
            "name": "neuroblast VLPl1",
            "syn": "neuroblast VLPl1",
            "id": "FBbt_00050103"
        }, {
            "name": "adult VLPl1 lineage clone",
            "syn": "FBbt_00050104",
            "id": "FBbt_00050104"
        }, {
            "name": "adult VLPl1 lineage clone",
            "syn": "adult VLPl1 lineage clone",
            "id": "FBbt_00050104"
        }, {
            "name": "adult DM3 lineage clone",
            "syn": "FBbt_00050101",
            "id": "FBbt_00050101"
        }, {
            "name": "adult DM3 lineage clone",
            "syn": "adult DM3 lineage clone",
            "id": "FBbt_00050101"
        }, {
            "name": "adult DM3 lineage clone",
            "syn": "DPMpm2 lineage neuron",
            "id": "FBbt_00050101"
        }, {
            "name": "adult DM3 lineage clone",
            "syn": "DM3 lineage clone",
            "id": "FBbt_00050101"
        }, {
            "name": "adult DM3 lineage neuron",
            "syn": "FBbt_00050102",
            "id": "FBbt_00050102"
        }, {
            "name": "adult DM3 lineage neuron",
            "syn": "adult DM3 lineage neuron",
            "id": "FBbt_00050102"
        }, {
            "name": "adult VPNd1 lineage clone",
            "syn": "FBbt_00050107",
            "id": "FBbt_00050107"
        }, {
            "name": "adult VPNd1 lineage clone",
            "syn": "adult VPNd1 lineage clone",
            "id": "FBbt_00050107"
        }, {
            "name": "ventral thoracic da3",
            "syn": "FBbt_00001176",
            "id": "FBbt_00001176"
        }, {
            "name": "ventral thoracic da3",
            "syn": "ventral thoracic da3",
            "id": "FBbt_00001176"
        }, {
            "name": "ventral thoracic da4",
            "syn": "FBbt_00001177",
            "id": "FBbt_00001177"
        }, {
            "name": "ventral thoracic da4",
            "syn": "ventral thoracic da4",
            "id": "FBbt_00001177"
        }, {
            "name": "adult VPNd1 lineage neuron",
            "syn": "FBbt_00050108",
            "id": "FBbt_00050108"
        }, {
            "name": "adult VPNd1 lineage neuron",
            "syn": "adult VPNd1 lineage neuron",
            "id": "FBbt_00050108"
        }, {
            "name": "adult VLPl1 lineage neuron",
            "syn": "FBbt_00050105",
            "id": "FBbt_00050105"
        }, {
            "name": "adult VLPl1 lineage neuron",
            "syn": "adult VLPl1 lineage neuron",
            "id": "FBbt_00050105"
        }, {
            "name": "ventral thoracic es",
            "syn": "FBbt_00001178",
            "id": "FBbt_00001178"
        }, {
            "name": "ventral thoracic es",
            "syn": "ventral thoracic es",
            "id": "FBbt_00001178"
        }, {
            "name": "ventral thoracic es1",
            "syn": "FBbt_00001179",
            "id": "FBbt_00001179"
        }, {
            "name": "ventral thoracic es1",
            "syn": "ventral thoracic es1",
            "id": "FBbt_00001179"
        }, {"name": "neuroblast VPNd1", "syn": "FBbt_00050106", "id": "FBbt_00050106"}, {
            "name": "neuroblast VPNd1",
            "syn": "neuroblast VPNd1",
            "id": "FBbt_00050106"
        }, {"name": "neuroblast DM3", "syn": "FBbt_00050100", "id": "FBbt_00050100"}, {
            "name": "neuroblast DM3",
            "syn": "neuroblast DM3",
            "id": "FBbt_00050100"
        }, {"name": "neuroblast DM3", "syn": "neuroblast DPMpm2", "id": "FBbt_00050100"}, {
            "name": "neuroblast DM3",
            "syn": "FBP3",
            "id": "FBbt_00050100"
        }, {
            "name": "ventral thoracic es5",
            "syn": "FBbt_00001183",
            "id": "FBbt_00001183"
        }, {
            "name": "ventral thoracic es5",
            "syn": "ventral thoracic es5",
            "id": "FBbt_00001183"
        }, {
            "name": "ventral thoracic es6",
            "syn": "FBbt_00001184",
            "id": "FBbt_00001184"
        }, {
            "name": "ventral thoracic es6",
            "syn": "ventral thoracic es6",
            "id": "FBbt_00001184"
        }, {
            "name": "ventral thoracic es7",
            "syn": "FBbt_00001185",
            "id": "FBbt_00001185"
        }, {
            "name": "ventral thoracic es7",
            "syn": "ventral thoracic es7",
            "id": "FBbt_00001185"
        }, {"name": "neuroblast VESa2", "syn": "FBbt_00050109", "id": "FBbt_00050109"}, {
            "name": "neuroblast VESa2",
            "syn": "neuroblast VESa2",
            "id": "FBbt_00050109"
        }, {
            "name": "ventral thoracic es8",
            "syn": "FBbt_00001186",
            "id": "FBbt_00001186"
        }, {
            "name": "ventral thoracic es8",
            "syn": "ventral thoracic es8",
            "id": "FBbt_00001186"
        }, {
            "name": "ventral thoracic es2",
            "syn": "FBbt_00001180",
            "id": "FBbt_00001180"
        }, {
            "name": "ventral thoracic es2",
            "syn": "ventral thoracic es2",
            "id": "FBbt_00001180"
        }, {
            "name": "ventral thoracic es3",
            "syn": "FBbt_00001181",
            "id": "FBbt_00001181"
        }, {
            "name": "ventral thoracic es3",
            "syn": "ventral thoracic es3",
            "id": "FBbt_00001181"
        }, {
            "name": "ventral thoracic es4",
            "syn": "FBbt_00001182",
            "id": "FBbt_00001182"
        }, {
            "name": "ventral thoracic es4",
            "syn": "ventral thoracic es4",
            "id": "FBbt_00001182"
        }, {
            "name": "adult SMPpv2 lineage neuron",
            "syn": "FBbt_00050114",
            "id": "FBbt_00050114"
        }, {
            "name": "adult SMPpv2 lineage neuron",
            "syn": "adult SMPpv2 lineage neuron",
            "id": "FBbt_00050114"
        }, {"name": "neuroblast LHd2", "syn": "FBbt_00050115", "id": "FBbt_00050115"}, {
            "name": "neuroblast LHd2",
            "syn": "neuroblast LHd2",
            "id": "FBbt_00050115"
        }, {"name": "neuroblast SMPpv2", "syn": "FBbt_00050112", "id": "FBbt_00050112"}, {
            "name": "neuroblast SMPpv2",
            "syn": "neuroblast SMPpv2",
            "id": "FBbt_00050112"
        }, {
            "name": "adult SMPpv2 lineage clone",
            "syn": "FBbt_00050113",
            "id": "FBbt_00050113"
        }, {
            "name": "adult SMPpv2 lineage clone",
            "syn": "adult SMPpv2 lineage clone",
            "id": "FBbt_00050113"
        }, {
            "name": "ventral thoracic es9",
            "syn": "FBbt_00001187",
            "id": "FBbt_00001187"
        }, {
            "name": "ventral thoracic es9",
            "syn": "ventral thoracic es9",
            "id": "FBbt_00001187"
        }, {"name": "neuroblast VESa1", "syn": "FBbt_00050118", "id": "FBbt_00050118"}, {
            "name": "neuroblast VESa1",
            "syn": "neuroblast VESa1",
            "id": "FBbt_00050118"
        }, {
            "name": "neuroblast VESa1",
            "syn": "neuroblast BAla3",
            "id": "FBbt_00050118"
        }, {
            "name": "ventral thoracic es10",
            "syn": "FBbt_00001188",
            "id": "FBbt_00001188"
        }, {
            "name": "ventral thoracic es10",
            "syn": "ventral thoracic es10",
            "id": "FBbt_00001188"
        }, {
            "name": "adult VESa1 lineage clone",
            "syn": "FBbt_00050119",
            "id": "FBbt_00050119"
        }, {
            "name": "adult VESa1 lineage clone",
            "syn": "adult VESa1 lineage clone",
            "id": "FBbt_00050119"
        }, {
            "name": "adult VESa1 lineage clone",
            "syn": "BAla3 lineage clone",
            "id": "FBbt_00050119"
        }, {
            "name": "ventral thoracic ch1",
            "syn": "FBbt_00001189",
            "id": "FBbt_00001189"
        }, {
            "name": "ventral thoracic ch1",
            "syn": "ventral thoracic ch1",
            "id": "FBbt_00001189"
        }, {
            "name": "adult LHd2 lineage clone",
            "syn": "FBbt_00050116",
            "id": "FBbt_00050116"
        }, {
            "name": "adult LHd2 lineage clone",
            "syn": "adult LHd2 lineage clone",
            "id": "FBbt_00050116"
        }, {
            "name": "adult LHd2 lineage neuron",
            "syn": "FBbt_00050117",
            "id": "FBbt_00050117"
        }, {
            "name": "adult LHd2 lineage neuron",
            "syn": "adult LHd2 lineage neuron",
            "id": "FBbt_00050117"
        }, {
            "name": "adult VESa2 lineage clone",
            "syn": "FBbt_00050110",
            "id": "FBbt_00050110"
        }, {
            "name": "adult VESa2 lineage clone",
            "syn": "adult VESa2 lineage clone",
            "id": "FBbt_00050110"
        }, {
            "name": "adult VESa2 lineage neuron",
            "syn": "FBbt_00050111",
            "id": "FBbt_00050111"
        }, {
            "name": "adult VESa2 lineage neuron",
            "syn": "adult VESa2 lineage neuron",
            "id": "FBbt_00050111"
        }, {
            "name": "adult ostiolar valve",
            "syn": "FBbt_00013166",
            "id": "FBbt_00013166"
        }, {
            "name": "adult ostiolar valve",
            "syn": "adult ostiolar valve",
            "id": "FBbt_00013166"
        }, {
            "name": "dorsal abdominal da3",
            "syn": "FBbt_00001194",
            "id": "FBbt_00001194"
        }, {
            "name": "dorsal abdominal da3",
            "syn": "dorsal abdominal da3",
            "id": "FBbt_00001194"
        }, {
            "name": "dorsal abdominal da4",
            "syn": "FBbt_00001195",
            "id": "FBbt_00001195"
        }, {
            "name": "dorsal abdominal da4",
            "syn": "dorsal abdominal da4",
            "id": "FBbt_00001195"
        }, {
            "name": "dorsal abdominal da5",
            "syn": "FBbt_00001196",
            "id": "FBbt_00001196"
        }, {
            "name": "dorsal abdominal da5",
            "syn": "dorsal abdominal da5",
            "id": "FBbt_00001196"
        }, {
            "name": "dorsal abdominal es",
            "syn": "FBbt_00001197",
            "id": "FBbt_00001197"
        }, {
            "name": "dorsal abdominal es",
            "syn": "dorsal abdominal es",
            "id": "FBbt_00001197"
        }, {
            "name": "dorsal abdominal cluster",
            "syn": "FBbt_00001190",
            "id": "FBbt_00001190"
        }, {
            "name": "dorsal abdominal cluster",
            "syn": "dorsal abdominal cluster",
            "id": "FBbt_00001190"
        }, {
            "name": "dorsal abdominal da",
            "syn": "FBbt_00001191",
            "id": "FBbt_00001191"
        }, {
            "name": "dorsal abdominal da",
            "syn": "dorsal abdominal da",
            "id": "FBbt_00001191"
        }, {
            "name": "dorsal abdominal da1",
            "syn": "FBbt_00001192",
            "id": "FBbt_00001192"
        }, {
            "name": "dorsal abdominal da1",
            "syn": "dorsal abdominal da1",
            "id": "FBbt_00001192"
        }, {
            "name": "dorsal abdominal da2",
            "syn": "FBbt_00001193",
            "id": "FBbt_00001193"
        }, {
            "name": "dorsal abdominal da2",
            "syn": "dorsal abdominal da2",
            "id": "FBbt_00001193"
        }, {
            "name": "dorsal abdominal es1",
            "syn": "FBbt_00001198",
            "id": "FBbt_00001198"
        }, {
            "name": "dorsal abdominal es1",
            "syn": "dorsal abdominal es1",
            "id": "FBbt_00001198"
        }, {
            "name": "dorsal abdominal es2",
            "syn": "FBbt_00001199",
            "id": "FBbt_00001199"
        }, {
            "name": "dorsal abdominal es2",
            "syn": "dorsal abdominal es2",
            "id": "FBbt_00001199"
        }, {
            "name": "adult abdominal pericardial cell",
            "syn": "FBbt_00013185",
            "id": "FBbt_00013185"
        }, {
            "name": "adult abdominal pericardial cell",
            "syn": "adult abdominal pericardial cell",
            "id": "FBbt_00013185"
        }, {
            "name": "adult abdominal pericardial cell",
            "syn": "Pcl",
            "id": "FBbt_00013185"
        }, {
            "name": "adult thoracic pericardial cell",
            "syn": "FBbt_00013184",
            "id": "FBbt_00013184"
        }, {
            "name": "adult thoracic pericardial cell",
            "syn": "adult thoracic pericardial cell",
            "id": "FBbt_00013184"
        }, {
            "name": "adult thoracic pericardial cell",
            "syn": "nephrocyte",
            "id": "FBbt_00013184"
        }, {
            "name": "adult VLPl&p2 lineage neuron",
            "syn": "FBbt_00050147",
            "id": "FBbt_00050147"
        }, {
            "name": "adult VLPl&p2 lineage neuron",
            "syn": "adult VLPl&p2 lineage neuron",
            "id": "FBbt_00050147"
        }, {
            "name": "adult VLPl&p2 lineage neuron",
            "syn": "adult VLPl_p2 lineage neuron",
            "id": "FBbt_00050147"
        }, {
            "name": "neuroblast CREa1 (female)",
            "syn": "FBbt_00050148",
            "id": "FBbt_00050148"
        }, {
            "name": "neuroblast CREa1 (female)",
            "syn": "neuroblast CREa1 (female)",
            "id": "FBbt_00050148"
        }, {
            "name": "neuroblast CREa1 (female)",
            "syn": "neuroblast CREa1f",
            "id": "FBbt_00050148"
        }, {"name": "neuroblast VLPl&p2", "syn": "FBbt_00050145", "id": "FBbt_00050145"}, {
            "name": "neuroblast VLPl&p2",
            "syn": "neuroblast VLPl&p2",
            "id": "FBbt_00050145"
        }, {
            "name": "neuroblast VLPl&p2",
            "syn": "neuroblast VLPl_p2",
            "id": "FBbt_00050145"
        }, {
            "name": "adult VLPl&p2 lineage clone",
            "syn": "FBbt_00050146",
            "id": "FBbt_00050146"
        }, {
            "name": "adult VLPl&p2 lineage clone",
            "syn": "adult VLPl&p2 lineage clone",
            "id": "FBbt_00050146"
        }, {
            "name": "adult VLPl&p2 lineage clone",
            "syn": "adult VLPl_p2 lineage clone",
            "id": "FBbt_00050146"
        }, {
            "name": "adult CREa1 (female) lineage clone",
            "syn": "FBbt_00050149",
            "id": "FBbt_00050149"
        }, {
            "name": "adult CREa1 (female) lineage clone",
            "syn": "adult CREa1 (female) lineage clone",
            "id": "FBbt_00050149"
        }, {
            "name": "adult CREa1 (female) lineage clone",
            "syn": "adult CREa1f lineage clone",
            "id": "FBbt_00050149"
        }, {
            "name": "adult LHp2 lineage clone",
            "syn": "FBbt_00050140",
            "id": "FBbt_00050140"
        }, {
            "name": "adult LHp2 lineage clone",
            "syn": "adult LHp2 lineage clone",
            "id": "FBbt_00050140"
        }, {
            "name": "adult DM6 lineage clone",
            "syn": "FBbt_00050143",
            "id": "FBbt_00050143"
        }, {
            "name": "adult DM6 lineage clone",
            "syn": "adult DM6 lineage clone",
            "id": "FBbt_00050143"
        }, {
            "name": "adult DM6 lineage clone",
            "syn": "CM1 lineage neuron",
            "id": "FBbt_00050143"
        }, {
            "name": "adult DM6 lineage clone",
            "syn": "DM6 lineage clone",
            "id": "FBbt_00050143"
        }, {
            "name": "adult DM6 lineage neuron",
            "syn": "FBbt_00050144",
            "id": "FBbt_00050144"
        }, {
            "name": "adult DM6 lineage neuron",
            "syn": "adult DM6 lineage neuron",
            "id": "FBbt_00050144"
        }, {
            "name": "adult LHp2 lineage neuron",
            "syn": "FBbt_00050141",
            "id": "FBbt_00050141"
        }, {
            "name": "adult LHp2 lineage neuron",
            "syn": "adult LHp2 lineage neuron",
            "id": "FBbt_00050141"
        }, {"name": "neuroblast DM6", "syn": "FBbt_00050142", "id": "FBbt_00050142"}, {
            "name": "neuroblast DM6",
            "syn": "neuroblast DM6",
            "id": "FBbt_00050142"
        }, {
            "name": "neuroblast DM6",
            "syn": "neuroblast CM1",
            "id": "FBbt_00050142"
        }, {
            "name": "adult VLPa1 lineage clone",
            "syn": "FBbt_00050158",
            "id": "FBbt_00050158"
        }, {
            "name": "adult VLPa1 lineage clone",
            "syn": "adult VLPa1 lineage clone",
            "id": "FBbt_00050158"
        }, {
            "name": "adult VLPa1 lineage neuron",
            "syn": "FBbt_00050159",
            "id": "FBbt_00050159"
        }, {
            "name": "adult VLPa1 lineage neuron",
            "syn": "adult VLPa1 lineage neuron",
            "id": "FBbt_00050159"
        }, {
            "name": "adult SLPal4 lineage neuron",
            "syn": "FBbt_00050156",
            "id": "FBbt_00050156"
        }, {
            "name": "adult SLPal4 lineage neuron",
            "syn": "adult SLPal4 lineage neuron",
            "id": "FBbt_00050156"
        }, {"name": "neuroblast VLPa1", "syn": "FBbt_00050157", "id": "FBbt_00050157"}, {
            "name": "neuroblast VLPa1",
            "syn": "neuroblast VLPa1",
            "id": "FBbt_00050157"
        }, {
            "name": "adult CREa1 (female) lineage neuron",
            "syn": "FBbt_00050150",
            "id": "FBbt_00050150"
        }, {
            "name": "adult CREa1 (female) lineage neuron",
            "syn": "adult CREa1 (female) lineage neuron",
            "id": "FBbt_00050150"
        }, {
            "name": "adult CREa1 (female) lineage neuron",
            "syn": "adult CREa1f lineage neuron",
            "id": "FBbt_00050150"
        }, {"name": "neuroblast SLPal3", "syn": "FBbt_00050151", "id": "FBbt_00050151"}, {
            "name": "neuroblast SLPal3",
            "syn": "neuroblast SLPal3",
            "id": "FBbt_00050151"
        }, {"name": "neuroblast SLPal4", "syn": "FBbt_00050154", "id": "FBbt_00050154"}, {
            "name": "neuroblast SLPal4",
            "syn": "neuroblast SLPal4",
            "id": "FBbt_00050154"
        }, {
            "name": "adult SLPal4 lineage clone",
            "syn": "FBbt_00050155",
            "id": "FBbt_00050155"
        }, {
            "name": "adult SLPal4 lineage clone",
            "syn": "adult SLPal4 lineage clone",
            "id": "FBbt_00050155"
        }, {
            "name": "adult SLPal3 lineage clone",
            "syn": "FBbt_00050152",
            "id": "FBbt_00050152"
        }, {
            "name": "adult SLPal3 lineage clone",
            "syn": "adult SLPal3 lineage clone",
            "id": "FBbt_00050152"
        }, {
            "name": "adult SLPal3 lineage neuron",
            "syn": "FBbt_00050153",
            "id": "FBbt_00050153"
        }, {
            "name": "adult SLPal3 lineage neuron",
            "syn": "adult SLPal3 lineage neuron",
            "id": "FBbt_00050153"
        }, {
            "name": "adult SLPad1 lineage clone",
            "syn": "FBbt_00050125",
            "id": "FBbt_00050125"
        }, {
            "name": "adult SLPad1 lineage clone",
            "syn": "adult SLPad1 lineage clone",
            "id": "FBbt_00050125"
        }, {
            "name": "adult SLPad1 lineage neuron",
            "syn": "FBbt_00050126",
            "id": "FBbt_00050126"
        }, {
            "name": "adult SLPad1 lineage neuron",
            "syn": "adult SLPad1 lineage neuron",
            "id": "FBbt_00050126"
        }, {
            "name": "adult DM2 lineage neuron",
            "syn": "FBbt_00050123",
            "id": "FBbt_00050123"
        }, {
            "name": "adult DM2 lineage neuron",
            "syn": "adult DM2 lineage neuron",
            "id": "FBbt_00050123"
        }, {"name": "neuroblast SLPad1", "syn": "FBbt_00050124", "id": "FBbt_00050124"}, {
            "name": "neuroblast SLPad1",
            "syn": "neuroblast SLPad1",
            "id": "FBbt_00050124"
        }, {
            "name": "adult AOTUv3 lineage neuron",
            "syn": "FBbt_00050129",
            "id": "FBbt_00050129"
        }, {
            "name": "adult AOTUv3 lineage neuron",
            "syn": "adult AOTUv3 lineage neuron",
            "id": "FBbt_00050129"
        }, {"name": "neuroblast AOTUv3", "syn": "FBbt_00050127", "id": "FBbt_00050127"}, {
            "name": "neuroblast AOTUv3",
            "syn": "neuroblast AOTUv3",
            "id": "FBbt_00050127"
        }, {
            "name": "adult AOTUv3 lineage clone",
            "syn": "FBbt_00050128",
            "id": "FBbt_00050128"
        }, {
            "name": "adult AOTUv3 lineage clone",
            "syn": "adult AOTUv3 lineage clone",
            "id": "FBbt_00050128"
        }, {"name": "neuroblast DM2", "syn": "FBbt_00050121", "id": "FBbt_00050121"}, {
            "name": "neuroblast DM2",
            "syn": "neuroblast DM2",
            "id": "FBbt_00050121"
        }, {"name": "neuroblast DM2", "syn": "FBP2", "id": "FBbt_00050121"}, {
            "name": "neuroblast DM2",
            "syn": "neuroblast DPMpm1",
            "id": "FBbt_00050121"
        }, {
            "name": "adult DM2 lineage clone",
            "syn": "FBbt_00050122",
            "id": "FBbt_00050122"
        }, {
            "name": "adult DM2 lineage clone",
            "syn": "adult DM2 lineage clone",
            "id": "FBbt_00050122"
        }, {
            "name": "adult DM2 lineage clone",
            "syn": "DPMpm1 lineage neuron",
            "id": "FBbt_00050122"
        }, {
            "name": "adult DM2 lineage clone",
            "syn": "DM2 lineage clone",
            "id": "FBbt_00050122"
        }, {
            "name": "adult VESa1 lineage neuron",
            "syn": "FBbt_00050120",
            "id": "FBbt_00050120"
        }, {
            "name": "adult VESa1 lineage neuron",
            "syn": "adult VESa1 lineage neuron",
            "id": "FBbt_00050120"
        }, {
            "name": "adult VESa1 lineage neuron",
            "syn": "adult BAla3 lineage neuron",
            "id": "FBbt_00050120"
        }, {"name": "neuroblast EBa1", "syn": "FBbt_00050136", "id": "FBbt_00050136"}, {
            "name": "neuroblast EBa1",
            "syn": "neuroblast EBa1",
            "id": "FBbt_00050136"
        }, {"name": "neuroblast EBa1", "syn": "neuroblast DALv2", "id": "FBbt_00050136"}, {
            "name": "neuroblast EBa1",
            "syn": "neuroblast EB",
            "id": "FBbt_00050136"
        }, {
            "name": "adult EBa1 lineage clone",
            "syn": "FBbt_00050137",
            "id": "FBbt_00050137"
        }, {
            "name": "adult EBa1 lineage clone",
            "syn": "adult EBa1 lineage clone",
            "id": "FBbt_00050137"
        }, {
            "name": "adult EBa1 lineage clone",
            "syn": "DALv2 lineage clone",
            "id": "FBbt_00050137"
        }, {
            "name": "adult EBa1 lineage clone",
            "syn": "EB lineage clone",
            "id": "FBbt_00050137"
        }, {
            "name": "adult VLPa2 lineage clone",
            "syn": "FBbt_00050134",
            "id": "FBbt_00050134"
        }, {
            "name": "adult VLPa2 lineage clone",
            "syn": "adult VLPa2 lineage clone",
            "id": "FBbt_00050134"
        }, {
            "name": "adult VLPa2 lineage neuron",
            "syn": "FBbt_00050135",
            "id": "FBbt_00050135"
        }, {
            "name": "adult VLPa2 lineage neuron",
            "syn": "adult VLPa2 lineage neuron",
            "id": "FBbt_00050135"
        }, {
            "name": "adult EBa1 lineage neuron",
            "syn": "FBbt_00050138",
            "id": "FBbt_00050138"
        }, {
            "name": "adult EBa1 lineage neuron",
            "syn": "adult EBa1 lineage neuron",
            "id": "FBbt_00050138"
        }, {
            "name": "adult EBa1 lineage neuron",
            "syn": "adult DALv2 lineage neuron",
            "id": "FBbt_00050138"
        }, {
            "name": "adult EBa1 lineage neuron",
            "syn": "adult EB lineage neuron",
            "id": "FBbt_00050138"
        }, {"name": "neuroblast LHp2", "syn": "FBbt_00050139", "id": "FBbt_00050139"}, {
            "name": "neuroblast LHp2",
            "syn": "neuroblast LHp2",
            "id": "FBbt_00050139"
        }, {
            "name": "adult VLPp&l1 lineage neuron",
            "syn": "FBbt_00050132",
            "id": "FBbt_00050132"
        }, {
            "name": "adult VLPp&l1 lineage neuron",
            "syn": "adult VLPp&l1 lineage neuron",
            "id": "FBbt_00050132"
        }, {
            "name": "adult VLPp&l1 lineage neuron",
            "syn": "adult VLPp_l1 lineage neuron",
            "id": "FBbt_00050132"
        }, {"name": "neuroblast VLPa2", "syn": "FBbt_00050133", "id": "FBbt_00050133"}, {
            "name": "neuroblast VLPa2",
            "syn": "neuroblast VLPa2",
            "id": "FBbt_00050133"
        }, {"name": "neuroblast VLPp&l1", "syn": "FBbt_00050130", "id": "FBbt_00050130"}, {
            "name": "neuroblast VLPp&l1",
            "syn": "neuroblast VLPp&l1",
            "id": "FBbt_00050130"
        }, {
            "name": "neuroblast VLPp&l1",
            "syn": "neuroblast VLPp_l1",
            "id": "FBbt_00050130"
        }, {
            "name": "adult VLPp&l1 lineage clone",
            "syn": "FBbt_00050131",
            "id": "FBbt_00050131"
        }, {
            "name": "adult VLPp&l1 lineage clone",
            "syn": "adult VLPp&l1 lineage clone",
            "id": "FBbt_00050131"
        }, {
            "name": "adult VLPp&l1 lineage clone",
            "syn": "adult VLPp_l1 lineage clone",
            "id": "FBbt_00050131"
        }, {
            "name": "adult FLAa2 lineage neuron",
            "syn": "FBbt_00050189",
            "id": "FBbt_00050189"
        }, {
            "name": "adult FLAa2 lineage neuron",
            "syn": "adult FLAa2 lineage neuron",
            "id": "FBbt_00050189"
        }, {
            "name": "hypodermal muscle of A1-7",
            "syn": "FBbt_00110299",
            "id": "FBbt_00110299"
        }, {
            "name": "hypodermal muscle of A1-7",
            "syn": "hypodermal muscle of A1-7",
            "id": "FBbt_00110299"
        }, {
            "name": "hypodermal muscle of A1-7",
            "syn": "body wall muscle",
            "id": "FBbt_00110299"
        }, {
            "name": "ventral VUM motor neuron",
            "syn": "FBbt_00110297",
            "id": "FBbt_00110297"
        }, {
            "name": "ventral VUM motor neuron",
            "syn": "ventral VUM motor neuron",
            "id": "FBbt_00110297"
        }, {
            "name": "ventral VUM motor neuron",
            "syn": "MNSNb/d-II",
            "id": "FBbt_00110297"
        }, {"name": "ventral VUM motor neuron", "syn": "ventral MN-VUM", "id": "FBbt_00110297"}];
        engine.add(searchresults);
        createAutocompleteList();
    }
}

function createAutocompleteList() {
    $('#searchtext').typeahead('destroy');
    $('#searchtext').typeahead({
        hint: true,
        minLength: 1
    }, {
        display: 'syn',
        limit: 2500,
        source: engine.ttAdapter(),
        templates: {
            empty: 'No matches yet...',
            suggestion: function (data) {
                if (data.syn == data.name) {
                    return '<p onclick="clickSearchResult(' + "'" + data.id + "'" + ');"><b>' + data.syn.replace($('#searchtext').val(), '<u>' + $('#searchtext').val() + '</u>') + "</b> <small>[<i>" + data.id.replace($('#searchtext').val(), '<u>' + $('#searchtext').val() + '</u>') + '</i>]</small></p>';
                } else if (data.syn == data.id) {
                    return '<p onclick="clickSearchResult(' + "'" + data.id + "'" + ');"><b>' + data.syn.replace($('#searchtext').val(), '<u>' + $('#searchtext').val() + '</u>') + "</b> <small>(" + data.name.replace($('#searchtext').val(), '<u>' + $('#searchtext').val() + '</u>') + ')</small></p>';
                } else {
                    return '<p onclick="clickSearchResult(' + "'" + data.id + "'" + ');"><b>' + data.syn.replace($('#searchtext').val(), '<u>' + $('#searchtext').val() + '</u>') + "</b> <small>(" + data.name.replace($('#searchtext').val(), '<u>' + $('#searchtext').val() + '</u>') + ") [<i>" + data.id.replace($('#searchtext').val(), '<u>' + $('#searchtext').val() + '</u>') + '</i>]</small></p>';
                }
            }
        }
    });
}

function updateSearchResults() {
    if (lastkey < (Date.now() - 100)) {
        var val = $('#searchtext').val();
        if (val.length > 0) {
            console.log('Searching for ' + val + '...');
            lastkey = Date.now();
            $.getJSON('/search/select?fl=short_form,label,synonym,id,type,has_narrow_synonym_annotation,has_broad_synonym_annotation&start=0&fq=ontology_name:(fbbt)&fq=is_obsolete:false&fq=shortform_autosuggest:VFB_*%20OR%20shortform_autosuggest:FBbt_*&rows=250&bq=is_defining_ontology:true^100.0%20label_s:"' + val + '"^2%20synonym_s:"' + val + '"%20in_subset_annotation:BRAINNAME^3%20short_form:FBbt_00003982^2&q="*' + val.split(' ').join('?') + '*"%20OR%20"' + val + '"&defType=edismax&qf=label%20synonym%20label_autosuggest_ws%20label_autosuggest_e%20label_autosuggest%20synonym_autosuggest_ws%20synonym_autosuggest_e%20synonym_autosuggest%20shortform_autosuggest%20has_narrow_synonym_annotation%20has_broad_synonym_annotation&wt=json&indent=true', function (data) {
                var resl = "";
                var top;
                var i;
                var j;
                var opt;
                var newresults = [];
                for (i in data.response.docs) {
                    if (data.response.docs[i].label) {
                        resl = data.response.docs[i].short_form;
                        if (i == '0') {
                            top = resl;
                            $('#searchid').text(resl);
                        }
                    }
                    opt = {name: data.response.docs[i].label, syn: resl, id: resl};
                    newresults.push(opt);
                    opt = {name: data.response.docs[i].label, syn: data.response.docs[i].label, id: resl};
                    newresults.push(opt);
                    for (j in data.response.docs[i].synonym) {
                        if (data.response.docs[i].label != data.response.docs[i].synonym[j]) {
                            opt = {name: data.response.docs[i].label, syn: data.response.docs[i].synonym[j], id: resl};
                            newresults.push(opt);
                        }
                    }
                    if (data.response.docs[i].has_narrow_synonym_annotation) {
                        for (j in data.response.docs[i].has_narrow_synonym_annotation) {
                            opt = {
                                name: data.response.docs[i].label,
                                syn: data.response.docs[i].has_narrow_synonym_annotation[j],
                                id: resl
                            };
                            newresults.push(opt);
                        }
                    }
                    if (data.response.docs[i].has_broad_synonym_annotation) {
                        for (j in data.response.docs[i].has_broad_synonym_annotation) {
                            opt = {
                                name: data.response.docs[i].label,
                                syn: data.response.docs[i].has_broad_synonym_annotation[j],
                                id: resl
                            };
                            newresults.push(opt);
                        }
                    }
                }
                while (searchresults.length > 0) {
                    resl = searchresults.pop();
                    if (!hasValue(newresults, 'id', resl.id)) {
                        newresults.push(resl);
                    }
                }
                searchresults = uniq_json(newresults);
                engine.add(searchresults);

                if ($('.tt-menu').children().first().text() == "No matches yet...") {
                    createAutocompleteList();
                    $('#searchtext').focus();
                }
            });
        }
    } else {
        lastkey = Date.now();
        if (!searchDelayed) {
            searchDelayed = true;
            window.setTimeout(function () {
                searchDelayed = false;
                updateSearchResults();
            }, 1000);
        }
    }
    checkSearchValue();
}

$('body').ready(function () {

    window.id = guid();

    initialiseSearchResults();

    engine.initialize();

    $('#searchtext').typeahead({
        hint: true,
        minLength: 1
    }, {
        display: 'syn',
        limit: 2500,
        source: engine.ttAdapter(),
        templates: {
            empty: 'No results found',
            suggestion: function (data) {
                if (data.syn == data.name) {
                    return '<p onclick="clickSearchResult(' + "'" + data.id + "'" + ');"><b>' + data.syn.replace($('#searchtext').val(), '<u>' + $('#searchtext').val() + '</u>') + "</b> <small>[<i>" + data.id.replace($('#searchtext').val(), '<u>' + $('#searchtext').val() + '</u>') + '</i>]</small></p>';
                } else {
                    return '<p onclick="clickSearchResult(' + "'" + data.id + "'" + ');"><b>' + data.syn.replace($('#searchtext').val(), '<u>' + $('#searchtext').val() + '</u>') + "</b> <small>(" + data.name.replace($('#searchtext').val(), '<u>' + $('#searchtext').val() + '</u>') + ") [<i>" + data.id.replace($('#searchtext').val(), '<u>' + $('#searchtext').val() + '</u>') + '</i>]</small></p>';
                }
            }
        }
    });

    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    $("#searchtext").keydown(function (e) {
        if (e.which == 13) {
            e.preventDefault();
            executeSearch();
        }
        checkSearchValue();
    });

    $("#searchtext").on('input', function () {
        checkSearchValue();
        updateSearchResults();
    });

    $('.tt-menu').on('click', function () {
        checkSearchValue();
        executeSearch();
    });

    $('#searchtext').blur(function () {
        $("#searchtext").css('width', 146);
        $('.tt-hint').css('width', 146);
    });

    $('#searchtext').focus(function () {
        var searchwidth = Math.floor(($(".navbar-right").offset().left - $("#searchtext").offset().left) - 43.0);
        if (searchwidth > 100) {
            $("#searchtext").css('width', searchwidth);
            $('.tt-hint').css('width', searchwidth);
        } else {
            $("#searchtext").css('width', '100%');
            $('.tt-hint').css('width', '100%');
        }
    });

    initStackData(null);
    window.setInterval(function () {
        updateStackCounter();
    }, 2000);
    window.setTimeout(function () {
        if ($('#viewer2DVal').text() == "*") {
            console.log('watchdog triggered!');
            loadDefaultData();
            alertMessage('Watchdog detected a problem - reset data');
        }
    }, 30000);
});
