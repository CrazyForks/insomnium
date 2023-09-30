import 'codemirror';

import { GraphQLInfoOptions } from 'codemirror-graphql/info';
import { ModifiedGraphQLJumpOptions } from 'codemirror-graphql/jump';
import { GraphQLSchema } from 'graphql';

/**** ><> ↑ --------- Third-party library imports ->  */
import { HandleGetRenderContext, HandleRender } from './common/render';
import { Settings } from './models/settings';
import { NunjucksParsedTag } from './templating/utils';

/**** ><> ↑ --------- Relative imports ->  */
type LinkClickCallback = (url: string) => void;

interface InsomniaExtensions {
  closeHintDropdown: () => void;
  enableNunjucksTags: (
    handleRender: HandleRender,
    handleGetRenderContext?: HandleGetRenderContext,
    showVariableSourceAndValue?: boolean,
  ) => void;
  isHintDropdownActive: () => boolean;
  makeLinksClickable: (handleClick: LinkClickCallback) => void;
}

/**** ><> ↑ --------- Definition of custom types ->  */
declare module 'codemirror' {
  type CodeMirrorLinkClickCallback = LinkClickCallback;

  interface Editor extends InsomniaExtensions {}
  interface EditorFromTextEditor extends InsomniaExtensions {}
  interface TextMarker {
    // This flag is being used internally by codemirror and the fold extension
    __isFold: boolean;
  }

  interface Variable {
    name: string;
    value: any;
  }

  interface Snippet {
    name: string;
    displayValue: string;
    value: string | (() => Promise<unknown>);
  }

  interface EnvironmentAutocompleteOptions extends Pick<Settings, 'hotKeyRegistry' | 'autocompleteDelay'> {
    getConstants?: () => string[] | PromiseLike<string[]>;
    getVariables?: () => Variable[] | PromiseLike<Variable[]>;
    getSnippets?: () => Snippet[] | PromiseLike<Snippet[]>;
    getTags?: () => NunjucksParsedTag[] | PromiseLike<NunjucksParsedTag[]>;
  }

  interface EditorConfiguration {
    info?: GraphQLInfoOptions;
    jump?: ModifiedGraphQLJumpOptions;
    environmentAutocomplete?: EnvironmentAutocompleteOptions;
  }

  interface Hint {
    /**
     * Custom Insomnium Key. Used for checking the type of the hint
     */
    type: 'constant' | 'variable' | 'snippet' | 'tag';
    /**
     * Custom Insomnium Key. The segment that matched and produced this hint
     */
    segment: string;
    /**
     * Custom Insomnium Key. This value gets displayed in the autocomplete menu.
     */
    displayValue: string;
    /**
     * Custom Insomnium Key. The display value of the hint
     */
    comment?: string;
    /**
     * Custom Insomnium Key. Used for sorting the hints
     */
    score: number;
    /**
     * Custom Insomnium Key. Used for snippet promises
     */
    text: string | (() => PromiseLike<unknown>);
  }

  interface ShowHintOptions {
    variables?: Variable[];
    constants?: string[];
    snippets?: Snippet[];
    tags?: NunjucksParsedTag[];
    showAllOnNoMatch?: boolean;
  }

  interface LintOptions {
    schema?: GraphQLSchema;
  }

  interface EditorEventMap {
    fold: (instance: Editor, from: Position) => void;
    unfold: (instance: Editor, from: Position) => void;
    cut: (instance: Editor, e: ClipboardEvent) => void;
    copy: (instance: Editor, e: ClipboardEvent) => void;
    paste: (instance: Editor, e: ClipboardEvent) => void;

  }

  const keyNames: Record<number, string>;
}
/**** ><> ↑ --------- Module declaration extensions ->  */
