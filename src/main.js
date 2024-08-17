// Program data
const {id, name:courseName, course_id, group_weight, assignments }=AssignmentGroup

// populate HTML from data
const courseTitle = document.getElementById('course-name')
courseTitle.innerText = `${CourseInfo.name} (${CourseInfo.id})`

// populate assignment details table
const assignmentDetailsTable = document.getElementById('assignment-group-details-table')
const [detialsHead, detailsBody]= assignmentDetailsTable.children
detialsHead.innerHTML = `<th>Field</th><th>Value</th>`
detailsBody.innerHTML = Object.entries(AssignmentGroup)
.slice(0,4)
.map(data=> `<tr><td>${data[0]}</td><td>${data[1]}</td></tr>`)
.join('')

// populate assignment table
const assignmentsTable = document.getElementById('assignment-group-table')
const [assignmentHead, assignementBody]= assignmentsTable.children
assignmentHead.innerHTML = `<th>Assignment ID</th>
<th>Name</th>
<th>Due Date</th>
<th>Points Possible</th>`
assignementBody.innerHTML = AssignmentGroup.assignments
.map(data=> `<tr>
  <td>${data.id}</td>
  <td>${data.name}</td>
  <td>${data.due_at}</td>
  <td>${data.points_possible}</td>
  </tr>`).join('')

// populate learner table
const learnerTable = document.getElementById('submissions-table')
const [learnerHead, learnerBody] = learnerTable.children
learnerHead.innerHTML = `<th>Learner ID</th>
<th>Assignment ID</th>
<th>Submission Date</th>
<th>Score</th>`
learnerBody.innerHTML = LearnerSubmissions
.map(data=> `<tr>
  <td>${data.learner_id}</td>
  <td>${data.assignment_id}</td>
  <td>${data.submission.submitted_at}</td>
  <td>${data.submission.score}</td>
  </tr>`).join('')



function validateCourse(courseInfo, assignmentGroup){
  if (courseInfo.id !== assignmentGroup.course_id)
    throw ("Mismatched course ID: Assignment group does not belong to this course")
}

//////////// Tests ////////////
// validateCourse({id:23}, {course_id:2})


function calculateScore(score, pointsPossible){
    pointsPossible = parseFloat(pointsPossible)
    score = parseFloat(score)
    if(pointsPossible !== 0)
      return score / pointsPossible * 100
    else
    throw Error("Division by Zero")
}
// console.log(calculateScore(47, 60))
// console.log(calculateScore(47, 0))


function isLateSubmission(dueDate, currentDate){
  dueDate = new Date(dueDate)
  currentDate = new Date(currentDate)
  return dueDate.getTime() !== currentDate.getTime()
}

// console.log(isLateSubmission("2023-01-25", "2023-01-25"))
// console.log(isLateSubmission("2023-01-25", "2023-01-26"))

function calculateWeightedAverages(submissions, assignments){

    
}






  function getLearnerData(courseInfo, assignmentGroup, submissions){

    const {assignments} = assignmentGroup
    console.log(assignments)

  }
  

  getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions)
//   function getLearnerData(course, ag, submissions) {
//     // here, we would process this data to achieve the desired result.
//     const result = [
//       {
//         id: 125,
//         avg: 0.985, // (47 + 150) / (50 + 150)
//         1: 0.94, // 47 / 50
//         2: 1.0 // 150 / 150
//       },
//       {
//         id: 132,
//         avg: 0.82, // (39 + 125) / (50 + 150)
//         1: 0.78, // 39 / 50
//         2: 0.833 // late: (140 - 15) / 150
//       }
//     ];
  
//     return result;
//   }
  
//   const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
  
//   console.log(result);
  

///////////////////////// DATA /////////////////////////  
