const fs = require("fs")
const data = require("../data.json")
const { age, date } = require('../utils')
const Intl = require("intl") 

exports.index = function(req, res) {
  return res.render("students/index", { students: data.students, options: {
    fifth_year: "5º ano do ensino fundamental",
    sixth_year: "6º ano do ensino fundamental",
    seventh_year: "7º ano do ensino fundamental",
    eigth_year: "8º ano do ensino fundamental",
    nineth_year: "9º ano do ensino fundamental",
    first_year: "1º ano do ensino médio",
    second_year: "2º ano do ensino médio",
    third_year: "3º ano do ensino médio"
  } })
}

exports.create = function(req, res) {
  return res.render("students/create", 
  { options: {
    fifth_year: "5º ano do ensino fundamental",
    sixth_year: "6º ano do ensino fundamental",
    seventh_year: "7º ano do ensino fundamental",
    eigth_year: "8º ano do ensino fundamental",
    nineth_year: "9º ano do ensino fundamental",
    first_year: "1º ano do ensino médio",
    second_year: "2º ano do ensino médio",
    third_year: "3º ano do ensino médio"
  } })
}

//create
exports.post = function (req, res) {
  const keys = Object.keys(req.body) //it will be an array of the keys of the object

  //* Checando se todos os campos estão preenchidos
  for (key of keys) {
    if (req.body[key] == "") {
      return res.send("Please, fill all the gaps")
    }
  }

  //* Desestruturação de dados
  let {
    avatar_url,
    name,
    email,
    birth,
    school_year,
    total_hours
  } = req.body

  birth = Date.parse(req.body.birth)
  const lastStudent = data.students[data.students.length - 1]
  let id

  if (lastStudent) {
    id = lastStudent.id + 1
  } else {
    id = 1
  }

  data.students.push({
    id,
    avatar_url,
    name,
    email,
    birth,
    school_year,
    total_hours
  })

  //* Escrevendo o nome professor no data.json
  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) {
      return res.send("Write file error")
    }
    return res.redirect("/students")
  })
  //return res.send(req.body)
}

//edit
exports.edit = function (req, res) {

  const {
    id
  } = req.params
  const foundStudent = data.students.find(function (student) {
    return student.id == id
  })

  if (!foundStudent) {
    return res.send("Student was not found!")
  }

  const student = {
    ...foundStudent,
    birth: date(foundStudent.birth).iso,
  }
  
  return res.render("students/edit", { student,
    options: {
    fifth_year: "5º ano do ensino fundamental",
    sixth_year: "6º ano do ensino fundamental",
    seventh_year: "7º ano do ensino fundamental",
    eigth_year: "8º ano do ensino fundamental",
    nineth_year: "9º ano do ensino fundamental",
    first_year: "1º ano do ensino médio",
    second_year: "2º ano do ensino médio",
    third_year: "3º ano do ensino médio"
    } })
}

//show
exports.show = function (req, res) {
  const {
    id
  } = req.params
  const foundStudent = data.students.find(function (student) {
    return student.id == id
  })

  if (!foundStudent) {
    return res.send("Student was not found!")
  }
  
  const student = {
    ...foundStudent,
    birth: date(foundStudent.birth).birthDay,
  }

  return res.render("students/show", {
    student,
    options: {
    fifth_year: "5º ano do ensino fundamental",
    sixth_year: "6º ano do ensino fundamental",
    seventh_year: "7º ano do ensino fundamental",
    eigth_year: "8º ano do ensino fundamental",
    nineth_year: "9º ano do ensino fundamental",
    first_year: "1º ano do ensino médio",
    second_year: "2º ano do ensino médio",
    third_year: "3º ano do ensino médio"
    }
  })
}

//atualizar
exports.put = function (req, res) {
  
  const { id } = req.body
  let index = 0  

  const foundStudent = data.students.find(function (student, foundIndex) {
    if (id == student.id) {
      index = foundIndex
      return true
    }
  })

  if (!foundStudent) {
    return res.send("Student was not found!")
  }

  const student = {
    ...foundStudent,
    ...req.body,
    birth: Date.parse(req.body.birth),
    id: Number(req.body.id)
  }

  data.students[index] = student

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    if(err) return res.send("Write error!")

    return res.redirect(`/students/${id}`)
  })
}

//deletar
exports.delete = function (req, res) {
  const {id} = req.body

  const filteredStudents = data.students.filter(function (student){
    return student.id != id
  })

  data.students = filteredStudents

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    if(err) return res.send("Write error!")

    return res.redirect("/students")
  })

}