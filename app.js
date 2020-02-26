/****************/
/* JS LIBRARIES */
/****************/
const JSZip = require("jszip");
const jsdom = require("jsdom");
var FileSaver = require("file-saver");
var pretty = require("pretty");

/********************/
/* GLOBAL VARIABLES */
/********************/

var zip = new JSZip();
const { JSDOM } = jsdom;
const reader = new FileReader();
var selected_json;

var css_input;
var js_input;
var section_id_input;
var section_class_input;

/************************/
/* FORM EVENT LISTENERS */
/************************/

document
  .getElementById("json_input")
  .addEventListener("change", function selectedFileChanged() {
    if (this.files.length === 0) {
      console.log("No file selected.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function fileReadCompleted() {
      // when the reader is done, the content is in reader.result.
      selected_json = JSON.parse(reader.result);

      // console.log("Content JSON: ");
      // console.log(selected_json);
    };
    reader.readAsText(this.files[0]);
  });

/*************************/
/* BUTTON EVENT LISTENER */
/*************************/

document.getElementById("button").addEventListener("click", buttonTest);

function buttonTest(e) {
  e.preventDefault();

  console.log("Button clicked!");

  css_input = document.getElementById("css_input").value;
  js_input = document.getElementById("js_input").value;
  section_id_input = document.getElementById("id_input").value;
  section_class_input = document.getElementById("class_input").value;

  if (css_input == "") {
    alert("A CSS file is required!");
  } else {
    const result = createXHTMLZipFolder(selected_json);
  }
}

function createXHTMLZipFolder(data) {
  var counter = 0;
  let asideCounter = 0;
  let pg = 01;
  let sec;
  let h2;
  let h3;
  let h4;
  let h5;
  let xhtml;

  let results = [];

  /********************************************************************************************************************************/

  /*********************************/
  /* FAKE DOM FOR CONTENT.OPF FILE */
  /*********************************/
  const content_dom = new JSDOM(
    `
<!DOCTYPE html>
    <body id="app">
        <?xml version="1.0" encoding="utf-8"?>
        <package xmlns="http://www.idpf.org/2007/opf" prefix="ibooks: http://vocabulary.itunes.apple.com/rdf/ibooks/vocabulary-extensions-1.0/" version="3.0" xml:lang="en" unique-identifier="ISBN-978-0-13-458983-1">
        <metadata xmlns:opf="http://www.idpf.org/2007/opf" xmlns:dc="http://purl.org/dc/elements/1.1/">
        <dc:title>{book title goes here}</dc:title>
        <dc:language>en-CA</dc:language>
        <dc:identifier id="ISBN-978-0-13-458983-1">{book isbn goes here}</dc:identifier>
        <dc:creator id="creator">The Catholic Bishops of Ontario, Alberta, Saskatchewan, and Northwest Territories</dc:creator>
        <meta property="dcterms:creator">The Catholic Bishops of Ontario, Alberta, Saskatchewan, and Northwest Territories</meta>
        <dc:publisher>Pearson Canada</dc:publisher>
        <dc:date>{created date goes here}</dc:date>
        <meta property="dcterms:modified">{last modified date goes here}</meta>
        <dc:rights>Copyright &#x00A9; {copyright year}</dc:rights>
        <meta property="rendition:layout">reflowable</meta>
        <meta property="rendition:orientation">auto</meta>
        <meta property="rendition:spread">auto</meta>
        <meta property="ibooks:specified-fonts">true</meta>
        <meta name="cover" content="cover-image"/>
        </metadata>
        
        <manifest>
        </manifest>
        
        <spine toc="ncx">
        </spine>
        </package>
    </body>
</html>
`,
    {
      includeNodeLocations: true
    }
  );
  content_dom.serialize();
  const content_document = content_dom.window.document;

  /********************************************************************************************************************************/

  /*********************************/
  /* FAKE DOM FOR toc.xhtml FILE */
  /*********************************/

  var toc_dom = new JSDOM(
    `
<html xmlns:m="http://www.w3.org/1998/Math/MathML" xmlns:epub="http://www.idpf.org/2007/ops" xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
    <head>
        <title>Insert Title Here</title>
        <link rel="stylesheet" type="text/css" href="../css/${css_input}.css"/>
        <meta charset="UTF-8"/>
    </head>

    <body>
      <nav class="toc" epub:type="toc" id="toc">
        <!-- Google Tag Manager (noscript) -->
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KPPR596" height="0" width="0" style="display:none;visibility:hidden"></iframe>
        </noscript>
        <!-- End Google Tag Manager (noscript) -->
        <h1 class="title title_01" epub:type="title" id="h1_01_toc">Content</h1>
        <ol>
        </ol>
      </nav></body></html>
  `
  );
  toc_dom.serialize();
  var toc_doc = toc_dom.window.document;

  /********************************************************************************************************************************/

  var meta_inf = zip.folder("META-INF");
  meta_inf.file("container.xml", "Testing");

  var ops = zip.folder("OPS");
  ops.folder("css");
  ops.folder("fonts");
  ops.folder("images");
  ops.folder("widgets");
  ops.folder("xhtml");

  /***********************************/
  /* CREATION OF .XHTML FILES STARTS */
  /***********************************/

  for (var key in data.content_structure) {
    //console.log(key);

    /********************************************************************************************************************************/

    /****************************/
    /* FAKE DOM FOR XHTML FILES */
    /****************************/
    var dom = new JSDOM(
      `
<?xml version="1.0" encoding="utf-8"?>
<html
  xmlns:m="http://www.w3.org/1998/Math/MathML"
  xmlns:epub="http://www.idpf.org/2007/ops"
  xmlns="http://www.w3.org/1999/xhtml"
  xml:lang="en"
  lang="en"
>
  <head>
    <title></title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   
  </head><body>
    <section></section></body></html>`,
      {
        includeNodeLocations: true
      }
    );
    dom.serialize();
    const doc = dom.window.document;

    //Adding JS (script tage) within the Head Tag
    if (js_input != "") {
      var jsTag = doc.createElement("script");
      jsTag.setAttribute("type", "text/javascript");
      jsTag.setAttribute("src", "../js/" + js_input + ".js");
      doc.querySelector("head").appendChild(jsTag);
    }

    //Adding CSS (link tag) within Head Tag
    var linkTag = doc.createElement("link");
    linkTag.setAttribute("rel", "stylesheet");
    linkTag.setAttribute("type", "text/css");
    linkTag.setAttribute("href", "../css/" + css_input + ".css");
    doc.querySelector("head").appendChild(linkTag);

    /********************************************************************************************************************************/

    for (let i = 0; i < data.content_structure[key].level_1.length; i++) {
      //BELOW: Level 1 Tag Creation
      let items = data.content_structure[key].level_1;
      //console.log(data.content_structure[key].level_1);

      //Adding Digital Page File Name to the Title Tag
      var titleTag = doc.querySelector("title");
      titleTag.innerHTML = data.content_structure[key].pageTitle;

      //Adding Parent Section ID and CLASS
      var sectionTag = doc.querySelector("section");
      sectionTag.id = section_id_input;
      sectionTag.className = section_class_input;

      //Adding epub:type to the Body Tag
      var bodyTag = doc.querySelector("body");
      bodyTag.setAttribute(
        "epub:type",
        data.content_structure[key].documentType
      );

      var badge1 = doc.createElement("section");
      if (items[i].digitalPageNumber < 10) {
        pg = "0" + items[i].digitalPageNumber;
      } else {
        pg = items[i].digitalPageNumber;
      }

      var secNumber = i + 1;
      if (secNumber < 10) {
        secNumber = "0" + secNumber;
      }

      badge1.id = key + "_sec" + secNumber;
      badge1.setAttribute("aria-labelledby", badge1.id + "_hdr");

      doc.querySelector("section").appendChild(badge1);

      var header1 = doc.createElement("header");
      header1.id = badge1.id + "_hdr";
      doc.getElementById(badge1.id).appendChild(header1);

      var level1 = doc.createElement("h1");
      level1.id = badge1.id + "_h1";
      level1.innerHTML = items[i].text;
      doc.getElementById(header1.id).appendChild(level1);
      xhtml = doc.getElementById(header1.id).appendChild(level1);

      //LEVEL 2 Tag Creation
      //BELOW: This loop through 'section' pages, because 'aside' pages wouldn't have a child array
      if (items[i].secondLevel.length > 0 && items[i].type == "section") {
        let level2asideCounter = 0;
        for (let ii = 0; ii < items[i].secondLevel.length; ii++) {
          if (items[i].secondLevel[ii].type == "aside") {
            if (ii < 10) {
              h2 = "0" + (ii + 1);
            } else {
              h2 = ii + 1;
            }
            var aside2 = doc.createElement("aside");
            aside2.id = badge1.id + "-comp" + h2;
            aside2.setAttribute("aria-labelledby", aside2.id + "_hdr");
            doc.getElementById(badge1.id).appendChild(aside2);

            var asideHeader2 = doc.createElement("header");
            asideHeader2.id = aside2.id + "_hdr";
            doc.getElementById(aside2.id).appendChild(asideHeader2);

            var level2heading6 = doc.createElement("h6");
            level2heading6.id = aside2.id + "_h6";
            level2heading6.innerHTML = items[i].secondLevel[ii].text;
            doc.getElementById(asideHeader2.id).appendChild(level2heading6);

            level2asideCounter++;
          } else {
            if (ii < 10) {
              h2 = "0" + (ii + 1 - level2asideCounter);
            } else {
              h2 = ii + 1 - level2asideCounter;
            }
            var badge2 = doc.createElement("section");
            badge2.id = badge1.id + "-" + h2;
            badge2.setAttribute("aria-labelledby", badge2.id + "_hdr");
            doc.getElementById(badge1.id).appendChild(badge2);

            var header2 = doc.createElement("header");
            header2.id = badge2.id + "_hdr";
            doc.getElementById(badge2.id).appendChild(header2);

            var level2 = doc.createElement("h2");
            level2.id = badge2.id + "_h2";
            level2.innerHTML = items[i].secondLevel[ii].text;
            doc.getElementById(header2.id).appendChild(level2);
          }

          //LEVEL 3 Tag Creation
          if (items[i].secondLevel[ii].type == "section") {
            let level3asideCounter = 0;
            for (
              let iii = 0;
              iii < items[i].secondLevel[ii].thirdLevel.length;
              iii++
            ) {
              if (items[i].secondLevel[ii].thirdLevel[iii].type == "aside") {
                if (iii < 10) {
                  h3 = "0" + (iii + 1);
                } else {
                  h3 = iii + 1;
                }
                var aside3 = doc.createElement("aside");
                aside3.id = badge2.id + "-comp" + h3;
                aside3.setAttribute("aria-labelledby", aside3.id + "_hdr");
                doc.getElementById(badge2.id).appendChild(aside3);

                var asideHeader3 = doc.createElement("header");
                asideHeader3.id = aside3.id + "_hdr";
                doc.getElementById(aside3.id).appendChild(asideHeader3);

                var level3heading6 = doc.createElement("h6");
                level3heading6.id = aside3.id + "_h6";
                level3heading6.innerHTML =
                  items[i].secondLevel[ii].thirdLevel[iii].text;
                doc.getElementById(asideHeader3.id).appendChild(level3heading6);

                level3asideCounter++;
              } else {
                if (iii < 10) {
                  h3 = "0" + (iii + 1 - level3asideCounter);
                } else {
                  h3 = iii + 1 - level3asideCounter;
                }
                var badge3 = doc.createElement("section");
                badge3.id = badge2.id + "-" + h3;
                badge3.setAttribute("aria-labelledby", badge3.id + "_hdr");
                doc.getElementById(badge2.id).appendChild(badge3);

                var header3 = doc.createElement("header");
                header3.id = badge3.id + "_hdr";
                doc.getElementById(badge3.id).appendChild(header3);

                var level3 = doc.createElement("h3");
                level3.id = badge3.id + "_h3";
                level3.innerHTML =
                  items[i].secondLevel[ii].thirdLevel[iii].text;
                doc.getElementById(header3.id).appendChild(level3);
              }

              //LEVEL 4 Tag Creation
              if (items[i].secondLevel[ii].thirdLevel[iii].type == "section") {
                let level4asideCounter = 0;
                for (
                  let iv = 0;
                  iv <
                  items[i].secondLevel[ii].thirdLevel[iii].fourthLevel.length;
                  iv++
                ) {
                  if (
                    items[i].secondLevel[ii].thirdLevel[iii].fourthLevel[iv]
                      .type == "aside"
                  ) {
                    if (iv < 10) {
                      h4 = "0" + (iv + 1);
                    } else {
                      h4 = iv + 1;
                    }
                    var aside4 = doc.createElement("aside");
                    aside4.id = badge3.id + "-comp" + h4;
                    aside4.setAttribute("aria-labelledby", aside4.id + "_hdr");
                    doc.getElementById(badge3.id).appendChild(aside4);

                    var asideHeader4 = doc.createElement("header");
                    asideHeader4.id = aside4.id + "_hdr";
                    doc.getElementById(aside4.id).appendChild(asideHeader4);

                    var level4heading6 = doc.createElement("h6");
                    level4heading6.id = aside4.id + "_h6";
                    level4heading6.innerHTML =
                      items[i].secondLevel[ii].thirdLevel[iii].fourthLevel[
                        iv
                      ].text;
                    doc
                      .getElementById(asideHeader4.id)
                      .appendChild(level4heading6);

                    level4asideCounter++;
                  } else {
                    if (iv < 10) {
                      h4 = "0" + (iv + 1 - level4asideCounter);
                    } else {
                      h4 = iv + 1 - level4asideCounter;
                    }
                    var badge4 = doc.createElement("section");
                    badge4.id = badge3.id + "-" + h4;
                    badge4.setAttribute("aria-labelledby", badge4.id + "_hdr");
                    doc.getElementById(badge3.id).appendChild(badge4);

                    var header4 = doc.createElement("header");
                    header4.id = badge4.id + "_hdr";
                    doc.getElementById(badge4.id).appendChild(header4);

                    var level4 = doc.createElement("h4");
                    level4.id = badge4.id + "_h4";
                    level4.innerHTML =
                      items[i].secondLevel[ii].thirdLevel[iii].fourthLevel[
                        iv
                      ].text;
                    doc.getElementById(header4.id).appendChild(level4);
                  }
                  //LEVEL 5 Tag Creation
                  if (
                    items[i].secondLevel[ii].thirdLevel[iii].fourthLevel[iv]
                      .type == "section"
                  ) {
                    let level5asideCounter = 0;
                    for (
                      let v = 0;
                      v <
                      items[i].secondLevel[ii].thirdLevel[iii].fourthLevel[iv]
                        .fifthLevel.length;
                      v++
                    ) {
                      if (
                        items[i].secondLevel[ii].thirdLevel[iii].fourthLevel[iv]
                          .fifthLevel[v].type == "aside"
                      ) {
                        if (v < 10) {
                          h5 = "0" + (v + 1);
                        } else {
                          h5 = v + 1;
                        }
                        var aside5 = doc.createElement("aside");
                        aside5.id = badge4.id + "-comp" + h5;
                        aside5.setAttribute(
                          "aria-labelledby",
                          aside5.id + "_hdr"
                        );
                        doc.getElementById(badge4.id).appendChild(aside5);

                        var asideHeader5 = doc.createElement("header");
                        asideHeader5.id = aside5.id + "_hdr";
                        doc.getElementById(aside5.id).appendChild(asideHeader5);

                        var level5heading6 = doc.createElement("h6");
                        level5heading6.id = aside5.id + "_h6";
                        level5heading6.innerHTML =
                          items[i].secondLevel[ii].thirdLevel[iii].fourthLevel[
                            iv
                          ].fifthLevel[v].text;
                        doc
                          .getElementById(asideHeader5.id)
                          .appendChild(level5heading6);

                        level5asideCounter++;
                      } else {
                        if (v < 10) {
                          h5 = "0" + (v + 1 - level5asideCounter);
                        } else {
                          h5 = v + 1 - level5asideCounter;
                        }

                        var badge5 = doc.createElement("section");
                        badge5.id = badge4.id + "-" + h5;

                        badge5.setAttribute(
                          "aria-labelledby",
                          badge5.id + "_hdr"
                        );
                        doc.getElementById(badge4.id).appendChild(badge5);

                        var header5 = doc.createElement("header");
                        header5.id = badge5.id + "_hdr";
                        //console.log(header5);
                        doc.getElementById(badge5.id).appendChild(header5);

                        var level5 = doc.createElement("h5");
                        level5.id = badge5.id + "_h5";
                        //console.log(level5);
                        level5.innerHTML =
                          items[i].secondLevel[ii].thirdLevel[iii].fourthLevel[
                            iv
                          ].fifthLevel[v].text;
                        doc.getElementById(header5.id).appendChild(level5);
                      }

                      if (
                        items[i].secondLevel[ii].thirdLevel[iii].fourthLevel[iv]
                          .fifthLevel[v].type == "aside"
                      ) {
                        // console.log("sidebar");
                      }
                      //asideCounter = 0;
                    }
                  } else {
                    // console.log("sidebar");
                  }
                  //asideCounter = 0;
                }
              } else {
                // console.log("sidebar");
              }
              //asideCounter = 0;
            }
          } else {
            // console.log("sidebar");
          }
          //asideCounter = 0;
        }
      } else {
        // console.log("sidebar");
        //END OF LEVEL 2 TAG CREATON
      }

      //BELOW: The line to create the page!!
      xhtml = badge1;

      // console.log(key);
      // console.log(pretty(xhtml.outerHTML));
      // console.log("\n");
      // console.log('<?xml version="1.0" encoding="utf-8"?>\n');
      // console.log(pretty(doc.querySelector("html").outerHTML));

      //BELOW: For the .xhtml file(s) creation AND add them to the "xhtml" folder
      ops
        .folder("xhtml")
        .file(
          key + ".xhtml",
          '<?xml version="1.0" encoding="utf-8"?>\n' +
            pretty(doc.querySelector("html").outerHTML)
        );
    }

    // console.log(counter);
    // console.log(xhtml);
    // console.log("END of " + key + ".xhtml file");

    counter++;
    // console.log("------------------------------------------------------");
  }

  /*********************************/
  /* CREATION OF .XHTML FILES ENDS */
  /*********************************/

  /********************************************************************************************************************************/

  /***************************************/
  /* CREATION OF CONTENT.OPF FILE STARTS */
  /***************************************/
  // var lineBreak = content_document.createElement("br");

  var tableOfContents = content_document.createComment("Table of Contents");
  content_document.querySelector("manifest").appendChild(tableOfContents);

  var ncx = content_document.createElement("item");
  ncx.id = "ncx";
  ncx.setAttribute("href", "toc.ncx");
  ncx.setAttribute("media-type", "application/x-dtbncx+xml");
  content_document.querySelector("manifest").appendChild(ncx);

  var toc = content_document.createElement("item");
  toc.id = "toc";
  toc.setAttribute("href", "xhtml/toc.xhtml");
  toc.setAttribute("properties", "nav");
  toc.setAttribute("media-type", "application/xhtml+xml");
  content_document.querySelector("manifest").appendChild(toc);

  /* Creates XHTML Items */

  var xhtmlPages = content_document.createComment("XHTML pages");

  content_document.querySelector("manifest").appendChild(xhtmlPages);

  for (var key in data.content_structure) {
    //console.log(key);

    var item = content_document.createElement("item");
    item.id = key;

    item.setAttribute("href", "xhtml/" + key + ".xhtml");
    item.setAttribute("media-type", "application/xhtml+xml");

    content_document.querySelector("manifest").appendChild(item);
  }

  /* Creates Spine references */
  for (var key in data.content_structure) {
    var itemref = content_document.createElement("itemref");
    itemref.setAttribute("idref", key);
    itemref.setAttribute("linear", "yes");

    content_document.querySelector("spine").appendChild(itemref);
  }

  //console.log(pretty(content_document.getElementById("app").innerHTML));

  //WRITE THE ABOVE DOM TO A FILE
  ops.file(
    "content.opf",
    pretty(content_document.getElementById("app").innerHTML)
  );

  /*************************************/
  /* CREATION OF CONTENT.OPF FILE ENDS */
  /*************************************/

  /********************************************************************************************************************************/

  /*************************************/
  /* CREATION OF TOC.XHTML FILE STARTS */
  /*************************************/

  for (var key in data.toc) {
    // console.log(key);
    for (let i = 0; i < data.toc[key].length; i++) {
      //BELOW: Level 1 Tag Creation
      let items = data.toc[key];
      // console.log(items[i].digitalPageFileName);

      var listItem1 = toc_doc.createElement("li");
      toc_doc.querySelector("ol").appendChild(listItem1);

      var anchor1 = toc_doc.createElement("a");
      anchor1.className = "xref";
      anchor1.href = items[i].digitalPageFileName;

      listItem1.appendChild(anchor1);

      var span1 = toc_doc.createElement("span");
      span1.className = "title";
      span1.innerHTML = items[i].title;

      anchor1.appendChild(span1);

      // listItem1.innerHTML = anchor1;

      if (items[i].secondLevel.length > 0) {
        var orderedList2 = toc_doc.createElement("ol");
        listItem1.appendChild(orderedList2);

        for (let ii = 0; ii < items[i].secondLevel.length; ii++) {
          var listItem2 = toc_doc.createElement("li");

          var anchor2 = toc_doc.createElement("a");
          anchor2.className = "xref";
          anchor2.href = items[i].secondLevel[ii].digitalPageFileName;

          var span2 = toc_doc.createElement("span");
          span2.className = "title";
          span2.innerHTML = items[i].secondLevel[ii].title;

          anchor2.appendChild(span2);
          listItem2.appendChild(anchor2);
          orderedList2.appendChild(listItem2);

          if (items[i].secondLevel[ii].thirdLevel.length > 0) {
            var orderedList3 = toc_doc.createElement("ol");
            listItem2.appendChild(orderedList3);

            for (
              let iii = 0;
              iii < items[i].secondLevel[ii].thirdLevel.length;
              iii++
            ) {
              var listItem3 = toc_doc.createElement("li");

              var anchor3 = toc_doc.createElement("a");
              anchor3.className = "xref";
              anchor3.href =
                items[i].secondLevel[ii].thirdLevel[iii].digitalPageFileName;

              var span3 = toc_doc.createElement("span");
              span3.className = "title";
              span3.innerHTML = items[i].secondLevel[ii].thirdLevel[iii].title;

              anchor3.appendChild(span3);
              listItem3.appendChild(anchor3);
              orderedList3.appendChild(listItem3);

              if (
                items[i].secondLevel[ii].thirdLevel[iii].fourthLevel.length > 0
              ) {
                var orderedList4 = toc_doc.createElement("ol");
                listItem3.appendChild(orderedList4);

                for (
                  let iv = 0;
                  iv <
                  items[i].secondLevel[ii].thirdLevel[iii].fourthLevel.length;
                  iv++
                ) {
                  var listItem4 = toc_doc.createElement("li");

                  var anchor4 = toc_doc.createElement("a");
                  anchor4.className = "xref";
                  anchor4.href =
                    items[i].secondLevel[ii].thirdLevel[iii].fourthLevel[
                      iv
                    ].digitalPageFileName;

                  var span4 = toc_doc.createElement("span");
                  span4.className = "title";
                  span4.innerHTML =
                    items[i].secondLevel[ii].thirdLevel[iii].fourthLevel[
                      iv
                    ].title;

                  anchor4.appendChild(span4);
                  listItem4.appendChild(anchor4);
                  orderedList4.appendChild(listItem4);

                  if (
                    items[i].secondLevel[ii].thirdLevel[iii].fourthLevel[iv]
                      .fifthLevel.length > 0
                  ) {
                    var orderedList5 = toc_doc.createElement("ol");
                    listItem4.appendChild(orderedList5);

                    for (
                      let v = 0;
                      v <
                      items[i].secondLevel[ii].thirdLevel[iii].fourthLevel[iv]
                        .fifthLevel.length;
                      v++
                    ) {
                      var listItem5 = toc_doc.createElement("li");

                      var anchor5 = toc_doc.createElement("a");
                      anchor5.className = "xref";
                      anchor5.href =
                        items[i].secondLevel[ii].thirdLevel[iii].fourthLevel[
                          iv
                        ].fifthLevel[v].digitalPageFileName;

                      var span5 = toc_doc.createElement("span");
                      span5.className = "title";
                      span5.innerHTML =
                        items[i].secondLevel[ii].thirdLevel[iii].fourthLevel[
                          iv
                        ].fifthLevel[v].title;

                      anchor5.appendChild(span5);
                      listItem5.appendChild(anchor5);
                      orderedList5.appendChild(listItem5);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  ops.file(
    "toc.xhtml",
    '<?xml version="1.0" encoding="utf-8"?>\n' +
      pretty(toc_doc.querySelector("html").outerHTML)
  );

  /***********************************/
  /* CREATION OF TOC.XHTML FILE ENDS */
  /***********************************/

  /********************************************************************************************************************************/

  /*********************************/
  /* CREATION OF OVERALL .ZIP FILE */
  /*********************************/
  zip.generateAsync({ type: "blob" }).then(function(blob) {
    saveAs(blob, "ePub.zip");
  });
}

/********************************************************************************************************************************/

/********************************************************************************************************************************/
