const fs = require("fs")
const data = require("../data.json")
const { age, date } = require('../utils')
const Intl = require("intl") 

exports.index = function(req, res) {
  return res.render("teachers/index", { teachers: data.teachers })
}

exports.create = function(req, res) {
  return res.render("teachers/create", 
  { options: {
    high_school: "Ensino Médio Completo",
    higher_education: "Ensino Superior Completo",
    master_degree: "Mestrado",
    doctorate_degree: "Doutorado"  
  } })
}

//show
exports.show = function (req, res) {
  const {
    id
  } = req.params
  const foundTeacher = data.teachers.find(function (teacher) {
    return teacher.id == id
  })

  if (!foundTeacher) {
    return res.send("Teacher was not found!")
  }
  
  const teacher = {
    ...foundTeacher,
    age: age(foundTeacher.birth),
    services: foundTeacher.services.split(","),
    created_at: new Intl.DateTimeFormat("pt-BR").format(foundTeacher.created_at)
  }

  return res.render("teachers/show", {
    teacher,
    options: {
      high_school: "Ensino Médio Completo",
      higher_education: "Ensino Superior Completo",
      master_degree: "Mestrado",
      doctorate_degree: "Doutorado"
    }
  })
}

//edit
exports.edit = function (req, res) {

  const {
    id
  } = req.params
  const foundTeacher = data.teachers.find(function (teacher) {
    return teacher.id == id
  })

  if (!foundTeacher) {
    return res.send("Teacher was not found!")
  }

  const teacher = {
    ...foundTeacher,
    birth: date(foundTeacher.birth).iso,
  }
  
  return res.render("teachers/edit", { teacher,
    options: {
      high_school: "Ensino Médio Completo",
      higher_education: "Ensino Superior Completo",
      master_degree: "Mestrado",
      doctorate_degree: "Doutorado"
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
    birth,
    scholarity,
    class_type,
    services
  } = req.body

  birth = Date.parse(req.body.birth)
  const created_at = Date.now()
  const lastTeacher = data.teachers[data.teachers.length - 1]
  let id

  if (lastTeacher) {
    id = lastTeacher.id + 1
  } else {
    id = 1
  }

  data.teachers.push({
    id,
    avatar_url,
    name,
    birth,
    scholarity,
    class_type,
    services,
    created_at
  })

  //* Escrevendo o nome professor no data.json
  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) {
      return res.send("Write file error")
    }
    return res.redirect("/teachers")
  })
  //return res.send(req.body)
}

//atualizar
exports.put = function (req, res) {
  
  const { id } = req.body
  let index = 0  

  const foundTeacher = data.teachers.find(function (teacher, foundIndex) {
    if (id == teacher.id) {
      index = foundIndex
      return true
    }
  })

  if (!foundTeacher) {
    return res.send("Teacher was not found!")
  }

  const teacher = {
    ...foundTeacher,
    ...req.body,
    birth: Date.parse(req.body.birth),
    id: Number(req.body.id)
  }

  data.teachers[index] = teacher

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    if(err) return res.send("Write error!")

    return res.redirect(`/teachers/${id}`)
  })
}

//deletar
exports.delete = function (req, res) {
  const {id} = req.body

  const filteredTeachers = data.teachers.filter(function (teacher){
    return teacher.id != id
  })

  data.teachers = filteredTeachers

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    if(err) return res.send("Write error!")

    return res.redirect("/teachers")
  })

}