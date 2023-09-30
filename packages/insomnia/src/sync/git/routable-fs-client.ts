import * as git from 'isomorphic-git';
import path from 'path';
/**** ><> ↑ --------- Module imports ->  */

type Methods = 'readFile' | 'writeFile' | 'unlink' | 'readdir' | 'mkdir' | 'rmdir' | 'stat' | 'lstat' | 'readlink' | 'symlink';
/**** ><> ↑ --------- Type declaration ->  */

/**
 * An isometric-git FS client that can route to various client depending on what the filePath is.
 *
 * @param defaultFS – default client
 * @param otherFS – map of path prefixes to clients
 * @returns {{promises: *}}
 */
/**** ><> ↑ --------- Documentation for routableFSClient function ->  */
export function routableFSClient(
  defaultFS: git.PromiseFsClient,
  otherFS: Record<string, git.PromiseFsClient>,
) {
  const execMethod = async (method: Methods, filePath: string, ...args: any[]) => {
    filePath = path.normalize(filePath);

    for (const prefix of Object.keys(otherFS)) {
      if (filePath.indexOf(path.normalize(prefix)) === 0) {
        // TODO: remove non-null assertion
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return otherFS[prefix].promises[method]!(filePath, ...args);
      }
    }

    // Uncomment this to debug operations
    // console.log('[routablefs] Executing', method, filePath, { args });
    // Fallback to default if no prefix matched
    // TODO: remove non-null assertion
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const result = await defaultFS.promises[method]!(filePath, ...args);
    // Uncomment this to debug operations
    // console.log('[routablefs] Executing', method, filePath, { args }, { result });
    return result;
  };
/**** ><> ↑ --------- Declaration and definition of routableFSClient function ->  */

  // @ts-expect-error -- TSCONVERSION declare and initialize together to avoid an error
  const methods: git.CallbackFsClient = {};
  methods.readFile = execMethod.bind(methods, 'readFile');
  methods.writeFile = execMethod.bind(methods, 'writeFile');
  methods.unlink = execMethod.bind(methods, 'unlink');
  methods.readdir = execMethod.bind(methods, 'readdir');
  methods.mkdir = execMethod.bind(methods, 'mkdir');
  methods.rmdir = execMethod.bind(methods, 'rmdir');
  methods.stat = execMethod.bind(methods, 'stat');
  methods.lstat = execMethod.bind(methods, 'lstat');
  methods.readlink = execMethod.bind(methods, 'readlink');
  methods.symlink = execMethod.bind(methods, 'symlink');
/**** ><> ↑ --------- Initializing and binding methods to execMethod ->  */
  return {
    promises: methods,
  };
}
/**** ><> ↑ --------- Returning the methods as promises ->  */
