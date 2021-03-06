
    jQuery(function(){
    	gridWidthAdapter('#listTable');
		$('#listTable').datagrid({
			title:'菜单管理', //标题
			method:'post',
			//iconCls:'icon-edit', //图标
			singleSelect:false, //多选
			height:'auto',//'406', //高度
			fitColumns: true, //自动调整各列，用了这个属性，下面各列的宽度值就只是一个比例。
			striped: true, //奇偶行颜色不同
			collapsible:false,//可折叠
			url:"queryMenuList", //数据来源
			sortName: 'SM_CODE', //排序的列
			sortOrder: 'asc', //倒序
			remoteSort: true, //服务器端排序
			idField:'uid', //主键字段
			queryParams:{}, //查询条件
			pagination:true, //显示分页
			pageList:[10,15,20,30,50],
			rownumbers:true, //显示行号
			columns:[[
				{field:'ck',checkbox:true,width:2}, //显示复选框
				{field:'SM_CODE',title:'编码',width:10,sortable:true,
					formatter:function(value,row,index){return row.SM_CODE;} //需要formatter一下才能显示正确的数据
				},
				{field:'SM_NAME',title:'菜单名称',width:18,sortable:true,
					formatter:function(value,row,index){return row.SM_NAME;}
				},
				{field:'SM_PAGE',title:'菜单URL',width:20,sortable:true,
					formatter:function(value,row,index){return row.SM_PAGE;}
				},
				{field:'SM_PARENT',title:'上级菜单编码',width:15,sortable:false,
					formatter:function(value,row,index){return row.SM_PARENT;}
				},
				{field:'parentMenuName',title:'上级菜单名称',width:18,sortable:true,
					formatter:function(value,row,index){return row.parentMenuName;}
				},
				{field:'SM_DESCRIPTION',title:'菜单说明',width:22,sortable:false,
					formatter:function(value,row,index){return row.SM_DESCRIPTION;}
				},
				{field:'SM_IS_TOP',title:'顶级菜单',width:10,sortable:false,
					formatter:function(value,row,index){return row.SM_IS_TOP == 'Y' ? '√' : '';}
				},
				{field:'SM_IS_USED',title:'是否启用',width:10,sortable:false,
					formatter:function(value,row,index){return row.SM_IS_USED == 'Y' ? '√' : '';}
				},
				{field:'CRT_C',title:'创建人',width:10,sortable:true,
					formatter:function(value,row,index){
						return row.CRT_C;
					}
				},
				{field:'CRT_DATE',title:'创建时间',width:20,sortable:true,
					formatter:function(value,row,index){
						return row.CRT_DATE;
						
						//var date = new Date(row.CRT_DATE);
						//return date.format('yyyy-MM-dd hh:mm:ss');
					}
				}
			]],
			onLoadSuccess:function(){
				$('#listTable').datagrid('clearSelections');
			}
		});

	});
	
    //新增
    function addrow(){
    	showWindow("#MyPopWindow",{
  			title:'新增菜单信息',
  			href:'sysmenu-edit',
  			width:450,
  			height:380,
  			onLoad: function(){
  				//$('#dataForm').form('clear');
  				$('#dataForm input[name="smIsUsed"]').attr("checked",true);
  			}
  			
  		});
	}
    
    //更新
    function updaterow(){
		var rows = $('#listTable').datagrid('getSelections');
		if(rows.length==0 || rows.length > 1){
			$.messager.alert('提示',"请选择一条记录,再进行操作.",'info');
			return;
		}
	
		showWindow("#MyPopWindow",{
  			title:'更新菜单信息',
  			href:'sysmenu-edit',
  			width:450,
  			height:380,
  			onLoad: function(){
  				setformVals(rows[0]);
  				
  				setMenuOpers(rows[0].uid);
  			}
  		});
	}
  	
    //编辑时，填充form值
    function setformVals(dataRow){
    	//编码不允许更改，并取消唯一验证事件
    	$("#dataForm input[name='smCode']").attr("disabled",true);
    	$("#dataForm input[name='smCode']").attr("onblur","");//取消失去焦点事件
    	
		$("#dataForm input[name='id']").val(dataRow.uid);
		$("#dataForm input[name='smCode']").val(dataRow.SM_CODE);
		$("#dataForm input[name='smName']").val(dataRow.SM_NAME);
		$("#dataForm input[name='smParent']").val(dataRow.SM_PARENT == null ? '':dataRow.SM_PARENT);
		var smIsUsed = dataRow.SM_IS_USED;
		if(smIsUsed != null && smIsUsed != ""){
			$("#dataForm input[name='smIsUsed'][value='"+ smIsUsed +"']").attr("checked",true);
		}
		var smIsTop = dataRow.SM_IS_TOP;
		if(smIsTop != null && smIsTop != ""){
			$("#dataForm input[name='smIsTop'][value='"+ smIsTop +"']").attr("checked",true);
		}
		$("#dataForm input[name='smPage']").val(dataRow.SM_PAGE == null ? '':dataRow.SM_PAGE);
		$("#dataForm textarea[name='smDescription']").val(dataRow.SM_DESCRIPTION == null ? '':dataRow.SM_DESCRIPTION);
    }
    
   
    //编辑时，填充 "操作信息"
    function setMenuOpers(suMenuId){
    	var shtml = '';
    	$.get("findOpers?smMenuId=" + suMenuId,function(data){
    		for(var i = 0 ; i < data.opers.length ; i ++){
    				shtml += '<tr>';
    				shtml += '<td><input type="text" class="textstyle wb80" name="smOpers.smoName" value="'+ data.opers[i].SMO_NAME +'"/></td>';
    				shtml += '<td><input type="text" class="textstyle wb80" name="smOpers.smoOperation" value="'+ data.opers[i].SMO_OPERATION +'" /></td>';
    				shtml += '<td><input type="checkbox" class="chkstyle" name="smOpers.smoValid" value="Y" checked="'+ (data.opers[i].SMO_VALID == 'Y' ? 'checked' : '') +'"/></td>';
    				shtml += '<td><a href="javascript:void(0)" onclick="deleteOper(this)">删除</a></td>';
    				shtml += '</tr>';
    		}
    		
    		$("table[name='opersInfo']").append(shtml);
    	});
    }
    
    //删除
  	function deleterow(){
  		var rows = $('#listTable').datagrid('getSelections');
		if(rows.length==0){
			$.messager.alert('提示',"请选择记录,再进行操作.",'info');
			return;
		}
  		$.messager.confirm('提示','确定要删除吗?',function(result){
	        if (result){
	        	var ps = "";
	        	$.each(rows,function(i,n){
	        		if(i==0) 
	        			ps += "?uid="+n.uid;
	        		else
	        			ps += "&uid="+n.uid;
	        	});
	        	$.post('deleteMenus'+ps,function(data){
		        	$('#listTable').datagrid('reload'); 
	        		$.messager.alert('提示',data.mes,'info');
	        	});
	        }
	    });
  	}
    //表格查询
	function search(){
		var params = $('#listTable').datagrid('options').queryParams; //先取得 datagrid 的查询参数
		var fields =$('#queryForm').serializeArray(); //自动序列化表单元素为JSON对象
		$.each( fields, function(i, field){
			params[field.name] = field.value; //设置查询参数
		}); 
		$('#listTable').datagrid('reload'); //设置好查询参数 reload 一下就可以了
	}
	
	//清空查询条件
	function clearForm(){
		$('#queryForm').form('clear');
		search();
	}