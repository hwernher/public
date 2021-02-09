var​ store = { 
  report: {
    4​: { id: ​4​, title: ​'Sample Report'​ },
    21​: { id: ​21​, title: ​'Portfolio Summary 2020'​ },
    }, 
  document: {
    8​: { id: ​8​, report_id: ​4​, name: ​'Sample Document'​, filetype: ​'txt'​ },
    34​: { id: ​34​, report_id: ​21​, name: ​'Quarterly Report'​, filetype: ​'pdf'​ }, 
    87​: { id: ​87​, report_id: ​21​, name: ​'Performance Summary'​, filetype: ​'pdf'​}
    }, 
  page: {
    19​: { id: ​19​, document_id: ​34, body: ​'Lorem ipsum...'​, footnote: ​null​ },
    21: { id: ​21, document_id: ​8, body: ​'Lorem ipsum...'​, footnote: ​null​ },
    72​: { id: ​72​, document_id: ​87​, body: ​'Ut aliquet...'​, footnote: ​'Aliquam erat...'​ }, 
    205​: { id: ​205​, document_id: ​34​, body: ​'Donec a dui et...'​, footnote: ​null​ },
  },
}



/*  Prompt 1 */

function mapReport(store){
  var result, report, reports, reportId, documents, pages, id;

  reports = store.report;
  documents = store.document;
  pages = store.page;
  result = {};

  // this is assuming that there are checks upstream to ensure clean store val (ie, no dulipcates in this map)
  for (id in pages){
    report = reports[documents[pages[id]?.document_id]?.report_id]
    if (report != undefined){
      reportId = report.id
      if (result[reportId]) {
          ++result[reportId].number_of_pages
      } else {
          result[reportId]= {'report_title': report.title, 'report_id': reportId, 'number_of_pages': 1}
      }
    }
  }
  return result;
}

/* example function call:
  mapReport(store)
 --------------------- */

/* Prompt 2 */
  
function mapStore (store){
  var reports, documents, pages, parentReports;

  reports = store.report;
  documents = store.document;
  pages = store.page;

  parentReports = mapObjectsToParentReport( mapObjectsToParentReport(pages, documents, 'document_id'), reports, 'report_id');
  return (Object.values(parentReports));
}

function mapObjectsToParentReport (childObject, parentObject, firstParentKeyType){
  var childId, parent, parentId;

  for (childId in childObject){
    parentId = childObject[childId][firstParentKeyType]
    parent = parentObject[parentId]
    
    if (parent != undefined){
      if (parent.children == undefined ) {parent.children = []}
      if (parent.report_id ){childObject[childId]['report_id'] = parent.report_id}
      parent.children.push(childObject[childId])
    }
  }
  return parentObject;
}​

function traverseReportMapBreadthFirst (parentQueue, searchString, searchIn ){
  var next, search_result, report_ids_list;
  report_ids_list =[];

  while (parentQueue.length) {
    next = parentQueue.pop()
    
    if (next){
      search_result = searchObjectForString(next, searchString, searchIn)
      if (search_result !== undefined){report_ids_list.push(search_result)}
      else if (next.children !== undefined) {parentQueue = (next.children).concat(parentQueue)}
    }
  }
  return report_ids_list;
}

function searchObjectForString (nextObject, searchString, searchIn){
  var property, index;

  for (property of searchIn){
    index = nextObject[property]?.toLowerCase().indexOf(searchString)
    if (index !== undefined && index !== -1){
      return nextObject.report_id || nextObject.id;
    } 
  }
}

function searchString (store, searchString, searchIn){
  var reportList, mappedStore;
  reportList = [];
  if (searchString) {
    mappedStore = mapStore(store);
    reportList.push(traverseReportMapBreadthFirst(mappedStore, searchString.toLowerCase(), searchIn));
    return reportList;
  }
}

/* example function call:

var fieldsToSearch = ['title', 'name', 'body', 'footnote']
var query = 'quart'
searchString(store, query, fieldsToSearch)
 --------------------- */



/* Prompt 3 */

/*
a) The signature of a basic async searchString function might look like this:

  async function searchString (query)

possible way to use this in a way that looks  "synchronous":  

async function searchString (query) {
  try { 
    var result = await fetch("/api/endpoint/?query_string="+ query);
    var data = result.data;
    return data;
  } catch (error){
    doSomethingWithError(error);
  }
}

This is a super basic (and probably not production-level) example-- I am not familiar with JS async functions to
feel confident in trying to explain a true async use-case at this point in time; the closest thing to JS async I've 
had experience with would be using SetTimeouts with synchronous functions. 

b) If this search function can produce errors, we could return messages to the user based on the kind of error, 
but not interrupt their interaction with the search field.  In the search function, you could define/throw new exceptions as well, 
such as InputTooShort, or EmptyResult. 

For example, in doSomethingWithError, we might map the error code to a message:

InternalServerError, PageNotFound: 'Results could not be loaded'
InputTooShort: 'Please enter at least 2 characters'
EmptyResult: 'No results found. Try broadening your search'

Depending on how you want the search field to look, you could even append the messages to a list and send
that as a "result" to be displayed in a dropdown, or map the error to an html template for a full-page display. 
    
*/


