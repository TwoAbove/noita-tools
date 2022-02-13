
// Ideally we use a JSON schema validator, but it doesn't handle sparse arrays well.
// Is there something to get deep sparse inclusion between js objects???
export interface IRule {
  type: string;
  params?: any;
  path?: string;
  strict?: boolean;
  // val shuold be a supported type by the structured clone algorithm:
  // https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
  val: any;
}
