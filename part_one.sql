
/* Prompt 1 */

SELECT
   document.id AS document_id 
FROM
   document 
   LEFT JOIN
      (
         SELECT DISTINCT
            document_id 
         FROM
            `page`
      )
      AS pages 
      ON pages.document_id = document.id 
WHERE
   pages.document_id IS NULL;

/* Prompt 2 */

SELECT
   report.title AS report_title,
   B.total_count AS page_count
FROM
   report 
   LEFT JOIN
      (
         SELECT
            report_id,
            SUM(A.page_count) AS total_count 
         FROM
            document
            LEFT JOIN
               (
                  SELECT
                     document_id,
                     COUNT(*) AS page_count
                  FROM
                     `page` 
                  GROUP BY
                     document_id
               )
               AS A 
               ON A.document_id = document.id 
         WHERE
            report_id 
         GROUP BY
            report_id
      )
      AS B 
      ON B.report_id = report.id 
WHERE
   B.total_count IS NOT NULL
ORDER BY
	report.title;


/* Prompt 3 

Create a new Comment table with the following columns (also assuming that there is some kind of User table):

id [int, NOT NULL, PK]
    - primary key
created_at  [datetime, NOT NULL, DEFAULT CURRENT_TIME] 
    - comment created at
modified_at [datetime, NOT NULL, DEFAULT CURRENT_TIME]
    - comment edited at (if the comment is updated after creation)
deleted_at [datetime, DEFAULT NULL]
    - if a comment is deleted by a user, fill in when they deleted it.  
properties [json, DEFAULT NULL]
    - {'text': <comment_text> }, a json containing the actual message text, as well as any other useful info.  
      Storing the text in a JSON feels safer than having it be an actual column, 
      can make changes to it without accidentally affecting the Dpages_per_report object attributes.
      Could set the character limit on the front end.
target_report_id [int, NOT NULL, FK references Report.ID]
    - Report is the highest parent object, so a comment must reference at least this-- otherwise, we're commenting on nothing
target_document_id [int, DEFAULT NULL, FK references Document.ID]
    - if a comment is on a Document, then this will be filled, as well as the parent Report id
target_page_id [int, DEFAULT NULL, FK references Page.ID]]
    - if a comment is on a Page, then this will be filled, as well as the parent Report id and Page id.
target_comment_id [int, DEFAULT NULL, FK references Comment.ID]
    - pages_per_reporty having this, you could allow a comment responding to another comment
user_id [int, NOT NULL, FK references User.ID]
    - the id of the entity writing the comment

Other considerations: 
    comment order: could load comments by dated created. If a comment is deleted, then no additional work is needed to preserve the comment order.
    comment threads: child comments would all reference the same parent comment, again displayed by date created. 
    comment deletion: If a comment with no children is deleted, then do not display. If a comment with children is deleted, could replace text with
        some filler phrase, but preserve the children comments. Would need to determine when to hard delete deleted comments, if at all.
*/
