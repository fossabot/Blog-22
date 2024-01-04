import { SendPost } from "../Send Fetch";
import { Editor } from "../Editor/Editor";
import { HandlePopMsg } from "../Navigation Bar/popMsg";
import '../../scss/Editor/style.scss';
import '../../scss/NewPostPage/index.scss';
import { IDomEditor } from "@wangeditor/editor";
import { UserVerification } from "../User Verification";
import { NavigationProgress } from "../Create Navigation Progress";
import { RetArticleData } from "../Send Fetch/interface";
export class UploadArticle
{
    private navigationProgress = new NavigationProgress();

    async init(id: number | null = null)
    {
        this.navigationProgress.start();
        const userVerification = new UserVerification();
        if (await userVerification.verification())
        {
            if (id)
            {
                const sendPost = new SendPost();
                await sendPost.CheckPermission(id);
            }
            await this.createPostComponents(id);
        }
        setTimeout(() =>{
            this.navigationProgress.end();
        }, 100)
    }

    async createPostComponents(id: number | null)
    {
        let article:RetArticleData | null = null;
        if(id){
            const sendPost = new SendPost();
            article = await sendPost.getArticleContent(id)
        }
        const body = document.body;
        const contentDiv = document.createElement('div');
        const postWrapper = document.createElement('div');
        contentDiv.id = 'contentDiv';
        contentDiv.className = 'contentDiv';

        postWrapper.className = 'postWrapper';

        function createTitleInput(title:string | null=null, area:string | null=null)
        {
            const inputWrapper = document.createElement('div');
            const titleWrapper = document.createElement('div');
            const areaWrapper = document.createElement('div');
            const titleInput = document.createElement('input');
            const areaSelect = document.createElement('select');

            inputWrapper.className = 'inputWrapper';

            titleWrapper.className = 'titleWrapper';

            areaWrapper.className = 'areaWrapper';

            titleInput.id = 'titleInput';
            titleInput.className = 'titleInput';
            titleInput.placeholder = 'Title';
            titleInput.autocomplete = 'off';
            if(title){
                titleInput.value = title;
            }

            areaSelect.id = 'areaSelect';
            areaSelect.className = 'areaSelect';

            const areaOptions = ['Programming', 'Anime'];

            areaOptions.forEach(optionValue =>
            {
                const option = document.createElement('option');
                option.value = optionValue;
                option.innerHTML = optionValue;
                areaSelect.appendChild(option);
            });

            if(area){
                areaSelect.value = area;
            }

            titleWrapper.appendChild(titleInput);
            areaWrapper.appendChild(areaSelect);
            inputWrapper.appendChild(titleWrapper);
            inputWrapper.appendChild(areaWrapper);

            postWrapper.appendChild(inputWrapper);
        }

        function createEditor(html: string | null = null) {
            const editorWarpper = document.createElement('div');
            const toolbar = document.createElement('div');
            const editorContainer = document.createElement('div');
        
            editorWarpper.id = 'editor—wrapper';
            editorWarpper.className = 'editor';
        
            toolbar.id = 'toolbar-container';
        
            editorContainer.id = 'editor-container';
            editorContainer.className = 'editor-container';
        
            editorWarpper.appendChild(toolbar);
            editorWarpper.appendChild(editorContainer);
            postWrapper.appendChild(editorWarpper);
        
            // 设置 editorContainer 初始高度
            setEditorContainerHeight();
        
            // 在窗口大小改变时重新设置 editorContainer 的高度
            window.addEventListener('resize', setEditorContainerHeight);
        
            const editor = new Editor();
            return editor.createEditor(html);
        
            function setEditorContainerHeight() {
                const postWrapper = document.querySelector('.postWrapper') as HTMLDivElement;   
                const postWrapperHeight = postWrapper.offsetHeight;
                const newEditorContainerHeight = postWrapperHeight - 85-63-60; // 90px 是固定值
                editorContainer.style.height = `${newEditorContainerHeight}px`;
            }
        }
        

        const createSubmit = (editor: IDomEditor) =>
        {
            const sendPost = new SendPost();
            const submitWrapper = document.createElement('div');
            const submitBtn = document.createElement('button');

            submitWrapper.className = 'submitWrapper';

            submitBtn.className = 'submitBtn';
            submitBtn.innerHTML = 'Submit';

            submitWrapper.appendChild(submitBtn);
            postWrapper.appendChild(submitWrapper);
            if (id === null)
            {
                submitBtn.onclick = () =>
                {
                    const titleInput = document.getElementById('titleInput') as HTMLInputElement;
                    const areaSelect = document.getElementById('areaSelect') as HTMLSelectElement;
                    const area = areaSelect.value;
                    const title = titleInput.value;
                    sendPost.UploadArticle(title, editor.getHtml(), area, 'blog');
                };
            } else
            {
                submitBtn.onclick = () =>
                {
                    const titleInput = document.getElementById('titleInput') as HTMLInputElement;
                    const areaSelect = document.getElementById('areaSelect') as HTMLSelectElement;
                    const area = areaSelect.value;
                    const title = titleInput.value;
                    sendPost.UpdateArticle(id, title, editor.getHtml(), area, 'blog');
                };
            }


        };
        contentDiv.appendChild(postWrapper);
        body.appendChild(contentDiv);
        if(article){
            createTitleInput(article.article.articleTitle, article.article.articleArea);
            const editor = createEditor(article.article.articleContent);
            createSubmit(editor);
        } else {
            createTitleInput()
            const editor = createEditor();
            createSubmit(editor);
        }


    }
}
