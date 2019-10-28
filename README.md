#QuickQuiz-M

## 2018/1/30提交最初版本V0.1 Beta
目前支持热控自动中级工技能鉴定、热机安全规程、2017团青知识竞赛题库共3个题库的学习与自测，目前实现的功能如下。

1. 各题库（包括单选、多选、判断、填空、简答、及各自定义类型）的浏览和答案查看。
2. 浏览时，按题目类型自定义学习范围。
3. 浏览时，打乱题目顺序，可依据随机Key来实现随机队列的复现。
4. 浏览时，跳转至题库中某一题目。
5. 浏览时，查找含有关键字的题目。
6. 各题库（包括单选、多选、判断、及各客观自定义类型）的测试和自动评分。
7. 夜间模式。
8. 题库数量容易扩展，理论支持一切由QuickQuiz 1.2.1 for Windows生成的qxml格式题库。

## 2018/1/31提交修改V0.1 Beta

1. 新增了从服务器拉取数据失败时在页面显示失败信息。
2. 在未输入跳转题目序号或输入错误时不跳转，防止误操作。
3. 在夜间模式中给正确题目添加外框线，给答错题目加删除线。
4. 交卷时进行提示。

## 2018/2/4提交修改V0.1 Beta2

1. 修正IE8加载本网页出错的问题，现使用IE8浏览已无报错（万恶的IE兼容性）。
2. 在浏览界面中新增折叠功能，可折叠不需要的部分。
3. 添加程序图标。
4. 添加cookie功能，保存夜间模式状态（12小时有效）和上一次读取的题库（30天有效）。
5. 添加加密功能，可设置加密题库。
6. 添加新题库《十九大精神题库》，权限为公开。
7. 修改了测试模式在夜间模式下正确答案的显示方式（在题目前显示对号）。

## 2018/2/5提交修改V0.1 Beta2

1. 主界面布局微调。
2. 修订了《十九大精神题库》。
3. 添加新题库《2016建投集团“两学一做”知识竞赛题库》，权限为公开。

## 2018/2/24提交修改V0.1 Beta2

1. 浏览界面布局微调。
2. 测试界面布局微调。
3. 测试界面新增标记题目功能，相当于书签，可在各标记题目间跳转。
4. 修正了答题超时仍提示是否交卷的问题，修正了剩余时间可能显示为负的问题。

## 2018/3/6提交修改V0.1 Beta2

1. 测试界面新增跳转功能和查找功能。
2. 修改了部分js文件结构。
3. 修订了热工自动装置中级工题库。

## 2018/3/13提交修改V0.1 Beta2

1. 修改了浏览界面显示答案的自动滚动逻辑。
2. 修订了热工自动装置中级工题库，为简答题添加了少量换行。

## 2018/4/9提交修改V0.1 Beta2

1. 将随机Key改为字符串映射了，这样可以输入有意义的字符串作为Key。

## 2018/4/10提交修改V0.1 Beta2

1. 浏览界面部分文字修改。
2. 解决Safari浏览器在重新载入主界面时滚动条默认不在最顶端的问题。

## 2018/4/13提交修改V0.1 Beta2

1. 添加新题库《安全规程电气部分》，权限为公开。

## 2018/4/21提交修改V0.1 Beta3

1. 修改了主界面布局，新增题目类别选择框，在题库较多时可分类浏览。
2. 在浏览界面和测试界面添加了密码验证，防止直接用url访问加密题库而绕过主界面判断。
3. 保存输入的密码，保存期限为7天。
4. 添加新题库《安全管理复审换证题库》，权限为加密。

## 2018/5/1提交修改V0.2 Beta

1. 修正了更新题目时如果选中的题目类型没有题目会导致出错的问题。
2. 修正了浏览模式多选题不能显示答案的问题。
3. 在浏览模式新增了书签功能，可以给题目设置书签并保存在本地，在不清空缓存的情况下可以长期保存。
4. 在测试模式修改为答题结束后依然可以标记题目并访问标记，此标记不存储。

## 2018/6/7提交修改V0.2 Beta

1. 添加新题库《热控DCS技能竞赛》，权限为公开。

## 2018/6/12提交修改V0.2 Beta

1. 新增选定范围进行随机排列的功能。

## 2018/8/15提交修改V0.2 Beta

1. 修正了设定随机范围时最后一题不参与排序的问题。
2. 将网页移植至码云，并按需求修改了链接。

## 2018/8/21提交修改V0.2 Beta

1. 修正了不同平台下随机key排序情况不同的问题。
2. 新增了网页图标。
3. 修改了页面字体。

## 2018/12/11提交修改V0.2 Beta

1. 添加新题库《危险源题库》，权限为加密。
2. 修改了浏览模式显示答案的滚动方式。

## 2019/4/11提交修改V1.0

1. 正式修改版本号为V1.0。
2. 添加新题库《2019青岛培训题库》，权限为加密。

## 2019/5/1提交修改V1.0

1. 添加了题目解析的显示。
2. 调整了题库的顺序。
3. 微调了界面。

## 2019/5/16提交修改V1.0

1. 添加新题库《钳工竞赛》，权限为公开。

## 2019/5/21提交修改V1.0

1. 修订题库《钳工工艺》。

## 2019/5/25提交修改V1.01

1. 新增作弊模式，用于大量题目的快速查找。

## 2019/5/29提交修改V1.01

1. 添加新题库《学习强国题库》，权限为公开。
2. 微调了界面，将夜间模式按钮缩小。
3. 修正了作弊模式下不能自动使用夜间模式的问题。

## 2019/5/31提交修改V1.01

1. 添加新题库《热控自动专业试题》，权限为公开。
2. 添加新题库《热控通信微机专业试题》，权限为公开。
3. 添加新题库《热控程控专业试题》，权限为公开。
4. 添加新题库《输煤电专业试题》，权限为公开。
5. 作弊模式下添加了清空输入框功能。

## 2019/6/3提交修改V1.01

1. 添加新题库《热控基础题库》，权限为公开。
2. 添加新题库《热控OC6000e题库》，权限为公开。
3. 修订题库《学习强国题库》。
4. 删除题库《热控DCS技能竞赛》，因与现有题库重复。
5. 修正了移动端图标可能显示不正确的问题。

## 2019/6/3提交修改V1.01

1. 基于学习强国吧修订《学习强国题库》共813题，权限为公开。

## 2019/6/18提交修改V1.01

1. 修订《学习强国题库》。
2. 修订《热控基础题库》。
3. 修订《热控自动专业试题》。
4. 添加新题库《2019热控在线答题》，权限为公开。

## 2019/6/18提交修改V1.01

1. 添加新题库《安全环保知识答题》，权限为加密。
2. 添加新题库《党政工知识答题》，权限为加密。
3. 修正了作弊模式读取加密题库不成功的问题。

## 2019/6/24提交修改V1.01

1. 修订《2019热控在线答题》。
2. 删除了《安全管理复审换证题库》《危险源题库》《热控通信微机专业试题》《输煤电专业试题》《钳工工艺》。

## 2019/6/29提交修改V1.01

1. 答题模式新增暂停功能。
2. 微调了部分界面。
3. 修订《学习强国题库》。
4. 修订《2019热控在线答题》。

## 2019/6/30提交修改V1.01

1. 修正了考试结束后仍有暂停功能按钮的问题。
2. 修订《2019热控在线答题》。

## 2019/7/3提交修改V1.01

1. 修订《安全环保知识答题》《党政工知识答题》。
2. 将作弊模式的输入框修改为查找类型（测试）。

## 2019/9/6提交修改V1.01

1. 修订《安全环保知识答题》《党政工知识答题》。

## 2019/9/12提交修改V1.01

1. 修订《学习强国题库》。

## 2019/10/28提交修改V1.01

1. 修订《安全环保知识答题》《党政工知识答题》。
