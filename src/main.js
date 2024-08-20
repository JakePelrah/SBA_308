
// errors table
let errorMessages = []
const errors = document.getElementById('errors-table')


// populate course info
const courseTitle = document.getElementById('course-name')
courseTitle.innerText = `${CourseInfo.name} (${CourseInfo.id})`

// populate assignment details table
const assignmentDetailsTable = document.getElementById('assignment-group-details-table')
const [detialsHead, detailsBody] = assignmentDetailsTable.children
detialsHead.innerHTML = `<th>ID</th>
<th>Course Name</th>
<th>Course ID</th>
<th>Group Weight</th>`
const { id, name, course_id, group_weight } = AssignmentGroup
detailsBody.innerHTML = `<tr>
    <td>${id}</td>
    <td>${name}</td>
    <td id="course-id">${course_id}</td>
    <td>${group_weight}</td>
    </tr>`

// populate assignment table
const assignmentsTable = document.getElementById('assignment-group-table')
const [assignmentHead, assignementBody] = assignmentsTable.children
assignmentHead.innerHTML = `<th>Assignment ID</th>
<th>Name</th>
<th>Due Date</th>
<th>Points Possible</th>`
assignementBody.innerHTML = AssignmentGroup.assignments
  .map(data => `<tr>
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
  .map(data => `<tr>
  <td>${data.learner_id}</td>
  <td>${data.assignment_id}</td>
  <td>${data.submission.submitted_at}</td>
  <td>${data.submission.score}</td>
  </tr>`).join('')


// populate assignment results
const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions)
const resultsTable = document.getElementById('results')
resultsTable.innerText = JSON.stringify(result)
console.log(result)



function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions) {
  // if an AssignmentGroup does not belong to its course (mismatching course_id), 
  // your program should throw an error, letting the user know that the input was invalid. 
  try {
    isValidCourse(courseInfo, assignmentGroup)
  }
  // catch the error
  catch {
    // add mismatch class;  see .mismatch in css file
    const courseID = document.getElementById('course-id')
    courseID.classList.add('mismatch')
    errorMessages.push('Mismatched course ID')
  }


  // destructure assignments
  const { assignments } = assignmentGroup

  try {
    // ensure data is in the correct format
    validatePointsFormat(assignments, learnerSubmissions)
  } catch {
    errorMessages.push('Assignments or submissions contains a non-numeric grade')
  }

  // populate error table
  for (const msg of errorMessages) {
    console.log(msg)
    errors.innerHTML += `<td>${msg}</td>`
  }


  // filter assignments that are not due or points possible is zero
  let filteredLearnerSubmissions = learnerSubmissions.map(learner => {

    // get the assignment info 
    const assignment = getAssignment(assignments, learner.assignment_id)

    // if assignment not due or points possible are not zero
    if (isDue(assignment.due_at)
      && parseFloat(assignment.points_possible)
      !== 0) {

      // simplify data
      learner = {
        ...learner,
        ...learner.submission,
        points_possible: assignment.points_possible,
        due_at: assignment.due_at
      }
      delete learner.submission
      return learner
    }
    // filter undefined entries
  }).filter(Boolean)

  // calculate final scores
  filteredLearnerSubmissions = filteredLearnerSubmissions.map(calculateScore)

  // group by learner id
  const idGroup = Object.groupBy(filteredLearnerSubmissions, ({ learner_id }) => learner_id)

  // calculate the average grade
  for (const learner in idGroup) {
    let num = 0
    let denom = 0
    idGroup[learner].forEach(element => {
      num += element.score
      denom += element.points_possible
    });
    idGroup[learner].average = num / denom
  }

  // restructure data
  let result = []
  for (const learner in idGroup) {
    let newObj = {}
    idGroup[learner].forEach(element => {
      newObj.id = element.learner_id
      newObj[element.assignment_id] = element.final_score
      newObj.avg = idGroup[learner].average
    });
    result.push(newObj)
  }

  return result
}



///////////////////////// HELPER FUNCTIONS /////////////////////////  

// validate the course courseInfo ID !== assigmentGroup ID
function isValidCourse(courseInfo, assignmentGroup) {
  // compare course id, throw an error if they don't match
  if (courseInfo.id !== assignmentGroup.course_id)
    throw ("Mismatched course ID: Assignment group does not belong to this course.")
}

// calculate the final score for the submission
function calculateScore(submission) {

  // destructure the submission
  let { score, points_possible, submitted_at, due_at } = submission

  // convert to floats
  points_possible = parseFloat(points_possible)
  score = parseFloat(score)

  // if the assignment is late 
  if (isLateSubmission(due_at, submitted_at)) {
    // deduct 10 percent of  the total points possible from their score for that assignment
    score -= points_possible * .10
  }

  return { ...submission, score, final_score: score / points_possible }
}

// check if submission if late
function isLateSubmission(dueDate, submissionDate) {

  // convert string date to Date object
  dueDate = new Date(dueDate)
  submissionDate = new Date(submissionDate)

  // if submission date falls after due date return true, else false
  return submissionDate.getTime() > dueDate.getTime()
}

// check if assignment is due
function isDue(dueDate) {

  // convert string date to Date object
  dueDate = new Date(dueDate)

  // if due date is less than current date
  return dueDate.getTime() <= new Date().getTime()
}

// find the assignment 
function getAssignment(assignments, learnerAssignmentId) {
  return assignments.find(obj => obj.id === learnerAssignmentId)
}


// parse points from assignements and submissions and check for NaN
function validatePointsFormat(assignments, learnerSubmissions) {

  // NaN flag
  let nanFlag = { nan: false }

  // check assignments for NaN
  for (const a of assignments) {
    if (isNaN(parseFloat(a.points_possible))) {
      nanFlag.nan = true
      nanFlag.type = 'assignments'
      break
    }
  }

  // check submissions for NaN
  for (const s of learnerSubmissions) {
    if (isNaN(parseFloat(s.submission.score))) {
      console.log(s.submission.score)
      nanFlag.nan = true
      nanFlag.type = 'submissions'
      break
    }
  }

  // throw an error if we find NaN
  if (nanFlag.nan) {
    throw Error(`${nanFlag.type} contains a score which is not a number`)
  }
}