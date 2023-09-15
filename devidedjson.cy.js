Cypress.config("taskTimeout", 9000000);
const filePath = "cypress/fixtures/mysql.json";
let res;

describe("Demo postgres", () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit("https://boldersciencestage.pixacore.com/");
    //Enter password
    cy.get("#password_protected_pass").type("BolderSc!ence");
    //Click on Login
    cy.get("#wp-submit").click();
  });

  it("mysql data", () => {
    Cypress.config("taskTimeout", 900000);
    const batchSize = 1000; // Specify the size of each batch
    const dataToWrite = []; // Array to accumulate the data

    cy.task(
      "queryDB",
      "SELECT post_title FROM bscience_posts INNER JOIN bscience_postmeta ON bscience_posts.ID = bscience_postmeta.post_id WHERE bscience_postmeta.meta_key = 'trial_status_change';"
    ).then((result2) => {
      console.log("result", result2);

      // Split the data into batches
      for (let i = 0; i < result2.length; i += batchSize) {
        const batch = result2.slice(i, i + batchSize);
        dataToWrite.push(batch);
      }

      // Write each batch to the JSON file
      const writePromises = dataToWrite.map((batch, index) => {
        const batchFilePath = `${filePath}_${index}.json`;
        return cy
          .writeFile(batchFilePath, JSON.stringify(batch), {
            timeout: 60000,
          })
          .then(() => {
            console.log(
              `Data batch ${index} written to JSON file successfully: ${batchFilePath}`
            );
          });
      });

      // Wait for all write operations to complete
      return Promise.all(writePromises);
    });
  });

  it("visit nct ID data", () => {
    const selectors = [
      {selector:"#studyDet-eligibility-criteria > .list-unstyled > :nth-child(1) > span",name:"Age"},
      {selector: "#studyDet-eligibility-criteria > .list-unstyled > :nth-child(2) > span",name: "Eligibility",},
      {selector: ".floatNone",name: "Sexes Eligible for Study",},
      {selector: "#studyDet-contact-and-locations > :nth-child(3)",name: "Contact and Locations",},
       { selector: ":nth-child(2) > .list-unstyled > :nth-child(1) > .mb-0", name: "Clinical gov identified" },
      { selector: ":nth-child(3) > .list-unstyled > :nth-child(1) > .mb-0", name: "First posted" },
      { selector: ".list-left-border.mb-0 > .mb-0", name: "Recruiting" },
      { selector: "#studyDet-description > :nth-child(3)", name: "Brief Summary" },
      { selector: "#studyDet-description > .list-unstyled > :nth-child(3) > span", name: "Phase" },
      { selector: "#studyDet-description > :nth-child(6)", name: "Study detailed description" },
      { selector: ".border-right > .list-unstyled > :nth-child(1) > span", name: "Study type" },
      { selector: ".border-right > .list-unstyled > :nth-child(2) > span", name: "Estimate enrolment" },
      { selector: ".border-right > .list-unstyled > :nth-child(3) > span", name: "Observation model" },
      { selector: ".border-right > .list-unstyled > :nth-child(4) > span", name: "Time perspective" },
      { selector: ".border-right > .list-unstyled > :nth-child(5) > span", name: "Official title" },
      { selector: ":nth-child(2) > .list-unstyled > :nth-child(1) > span", name: "Actual study start date" },
      { selector: ":nth-child(2) > .list-unstyled > :nth-child(2) > span", name: "Estimate primary completion date" },
      { selector: ":nth-child(2) > .list-unstyled > :nth-child(3) > span", name: "Estimate completion date" },
    ];
  
    // Initialize an object to store the empty elements for all NCTIDs
    const allEmptyElements = {};
  
    cy.fixture("mysql.json_0.json").then((jsonData) => {
      jsonData.forEach((item) => {
        const nctId = item.post_title;
        const url = "https://boldersciencestage.pixacore.com/trial/" + nctId;
  
        cy.visit(url, { failOnStatusCode: false }).then((response) => {
          if (response.status === 500) {
            console.error(`Error: 500 Internal Server Error for URL: ${url}`);
          }
  
          // Initialize an object to store the empty elements for this NCTID
          const emptyElements = {};
  
          // Check the text for each selector
          cy.wrap(selectors).each((selectorItem) => {
            cy.get(selectorItem.selector, { timeout: 10000 }).then(($element) => {
              const text = $element.text().trim();
              if (text === "") {
                emptyElements[selectorItem.name] = selectorItem.name;
              }
            });
          });
  
          // Add the empty elements for this NCTID to the allEmptyElements object
          allEmptyElements[nctId] = emptyElements;
        });
      });
    }).then(() => {
      // After visiting all NCTIDs, write the empty elements to a single JSON file
      cy.writeFile(`cypress/fixtures/emptydata.json`, allEmptyElements);
    });
  });
  it.only("visit nct ID data", () => {
    const selectors = [
      {selector:"#studyDet-eligibility-criteria > .list-unstyled > :nth-child(1) > span",name:"Age"},
      {selector: "#studyDet-eligibility-criteria > .list-unstyled > :nth-child(2) > span",name: "Eligibility",},
      {selector: ".floatNone",name: "Sexes Eligible for Study",},
      {selector: "#studyDet-contact-and-locations > :nth-child(3)",name: "Contact and Locations",},
       { selector: ":nth-child(2) > .list-unstyled > :nth-child(1) > .mb-0", name: "Clinical gov identified" },
      { selector: ":nth-child(3) > .list-unstyled > :nth-child(1) > .mb-0", name: "First posted" },
      { selector: ".list-left-border.mb-0 > .mb-0", name: "Recruiting" },
      { selector: "#studyDet-description > :nth-child(3)", name: "Brief Summary" },
      { selector: "#studyDet-description > .list-unstyled > :nth-child(3) > span", name: "Phase" },
      { selector: "#studyDet-description > :nth-child(6)", name: "Study detailed description" },
      { selector: ".border-right > .list-unstyled > :nth-child(1) > span", name: "Study type" },
      { selector: ".border-right > .list-unstyled > :nth-child(2) > span", name: "Estimate enrolment" },
      { selector: ".border-right > .list-unstyled > :nth-child(3) > span", name: "Observation model" },
      { selector: ".border-right > .list-unstyled > :nth-child(4) > span", name: "Time perspective" },
      { selector: ".border-right > .list-unstyled > :nth-child(5) > span", name: "Official title" },
      { selector: ":nth-child(2) > .list-unstyled > :nth-child(1) > span", name: "Actual study start date" },
      { selector: ":nth-child(2) > .list-unstyled > :nth-child(2) > span", name: "Estimate primary completion date" },
      { selector: ":nth-child(2) > .list-unstyled > :nth-child(3) > span", name: "Estimate completion date" },
    ];
  
    // Initialize an object to store the empty elements for all NCTIDs
    const allEmptyElements = {};
  
    cy.fixture("mysql.json_0.json").then((jsonData) => {
      jsonData.forEach((item) => {
        const nctId = item.post_title;
        const url = "https://boldersciencestage.pixacore.com/trial/" + nctId;
  
        cy.visit(url, { failOnStatusCode: false }).then((response) => {
          if (response.status === 500) {
            console.error(`Error: 500 Internal Server Error for URL: ${url}`);
          }
  
          // Initialize an array to store the empty elements for this NCTID
          const emptyElements = [];
  
          // Check the text for each selector
          cy.wrap(selectors).each((selectorItem) => {
            cy.get(selectorItem.selector, { timeout: 10000 }).then(($element) => {
              const text = $element.text().trim();
              if (text === "") {
                emptyElements.push(selectorItem.name);
              }
            });
          });
  
          // Add the array of empty elements for this NCTID to the allEmptyElements object
          allEmptyElements[nctId] = emptyElements;
        });
      });
    }).then(() => {
      // After visiting all NCTIDs, you can access the array for each NCTID
      // For example, allEmptyElements["NCT04771481"] will contain ["Age", "Eligibility", "Sexes Eligible for Study"]
      console.log(allEmptyElements); // Print the result for further analysis
       // Write the result to a JSON file
    cy.writeFile("cypress/fixtures/emptydata.json", allEmptyElements);
    });
  });
  
  });
