const graphql = require('graphql');
const _ = require('lodash');
const Project = require('../models/project');
const Task = require('../models/task');
const{ GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;


const TaskType = new graphql.GraphQLObjectType({
  name: 'Task',
  fields: () => ({
    id: { type: graphql.GraphQLID },
    title: { type: graphql.GraphQLString },
    weight: { type: graphql.GraphQLInt },
    description: { type: graphql.GraphQLString },
    project: {
      type: TaskType,
      resolve(parent, args) {
        return Project.findById(parent.projectId);
      }
    }
  })
});

const RootQuery = new graphql.GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    task: {
      type: TaskType,
      args: { id: {type: graphql.GraphQLID} },
      resolve(parent, args) {
        return Task.findById(args.id);
      }
    },
    project: {
      type: ProjectType,
      args: { id: {type: graphql.GraphQLID} },
      resolve(parent, args){
        return Project.findById(args.id);
      }
    },
    tasks: {
      type: new graphql.GraphQLList(TaskType),
      resolve: () => Task.find({})
    },
    projects: {
      type: new graphql.GraphQLList(ProjectType),
      resolve: () => Project.find({})
    }
  })
});

const ProjectType = new graphql.GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: { type: graphql.GraphQLID },
    title: { type: graphql.GraphQLString },
    weight: { type: graphql.GraphQLInt },
    description: { type: graphql.GraphQLString },
    tasks: {
      type: new graphql.GraphQLList(TaskType),
      resolve(parent, args) {
        return Task.find({projectId:parent.id});
      }
    }
  })
});

const Mutation = new graphql.GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addProject: {
      type: ProjectType,
      args: {
        title: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
        weight: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
        description: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) }
      },
      resolve: (parent, args) => {
        const newProject = new Project({
          title: args.title,
          weight: args.weight,
          description: args.description
        });
        return newProject.save();
      }
    },
    addTask: {
      type: TaskType,
      args: {
        title: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
        weight: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
        description: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
        projectId: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt ) }
      },
      resolve: (parent, args) => {
        const newTask = new Task({
          title: args.title,
          weight: args.weight,
          description: args.description,
          projectId: args.projectId
        });
        return newTask.save();
      }
    },
  })
})

module.exports = new graphql.GraphQLSchema({
  query:RootQuery,
  mutation: Mutation
});
