// import { InputType, Field } from '@nestjs/graphql';
// import { GraphQLString } from 'graphql/type';
// import { v4 as uuid4 } from 'uuid';
// import { AttributeValue } from '@aws-sdk/client-dynamodb';
// import { QandA } from '../interfaces/interfaces';
// @InputType()
// export class QuestionAnswer {
//   @Field(() => GraphQLString, { description: 'Question text' })
//   question!: string;

//   @Field(() => GraphQLString, {
//     description: 'User response (yes, no or short sentence)',
//   })
//   answer!: string;

//   static createDynamoDBObjectFromInstance(
//     input: QuestionAnswer,
//   ): Record<string, AttributeValue> {
//     return {
//       id: {
//         S: uuid4(),
//       },
//       question: {
//         S: input.question,
//       },
//       answer: {
//         S: input.answer,
//       },
//     };
//   }

//   static createInstanceFromDynamoDBObject(data: any): QandA {
//     return {
//       question: data.question.S,
//       answer: data.answer.S,
//     };
//   }
// }
