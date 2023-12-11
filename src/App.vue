<script setup lang="ts">
import StoreContain from "./components/storeContain";
import Latex from "./features/latex.vue";
import {
  NDialogProvider,
  NNotificationProvider,
  NMessageProvider,
  NButton,
} from "naive-ui";
let a = {
  "type": "ConditionalExpression",
  "config": {
    "id": "1",
    "latexName": "Conditional",
    "parentId": "-1",
    "alias": "if",
    "componentName": "Conditional"
  },
  "test": {
    "type": "BinaryExpression",
    "config": {
      "id": "2",
      "latexName": "Eq",
      "parentId": "1",
      "alias": "==",
      "componentName": "Logical",
      "data": {
        "operator": "\\equiv"
      }
    },
    "operator": "Eq",
    "left": {
      "type": "CallExpression",
      "config": {
        "id": "3",
        "latexName": "Absolute",
        "parentId": "2",
        "alias": "绝对值",
        "componentName": "SingleContain"
      },
      "callee": "Absolute",
      "argument": {
        "type": "Literal",
        "config": {
          "id": "4",
          "latexName": "aa",
          "parentId": "3",
          "alias": "aa",
          "componentName": "Filed"
        },
        "value": "aa"
      }
    },
    "right": {
      "type": "CallExpression",
      "config": {
        "id": "5",
        "latexName": "Median",
        "parentId": "2",
        "alias": "中位数",
        "componentName": "SingleContain"
      },
      "callee": "Median",
      "argument": {
        "type": "Literal",
        "config": {
          "id": "6",
          "latexName": "bb",
          "parentId": "5",
          "alias": "bb",
          "componentName": "Filed"
        },
        "value": "bb"
      }
    }
  },
  "consequent": {
    "type": "BinaryExpression",
    "config": {
      "id": "7",
      "latexName": "Div",
      "parentId": "1",
      "alias": "除",
      "componentName": "Binary",
      "data": {
        "operator": "{\\div}"
      }
    },
    "operator": "Div",
    "left": {
      "type": "NumberLiteral",
      "config": {
        "id": "9",
        "latexName": "3",
        "parentId": "8",
        "alias": "3",
        "componentName": "NumberFiled",
        "bracket": {
          "id": "8",
          "latexName": "Number",
          "parentId": "7",
          "alias": "数值",
          "componentName": "NumberContain"
        }
      },
      "value": "3"
    },
    "right": {
      "type": "CallExpression",
      "config": {
        "id": "10",
        "latexName": "Median",
        "parentId": "7",
        "alias": "中位数",
        "componentName": "SingleContain"
      },
      "callee": "Median",
      "argument": {
        "type": "Literal",
        "config": {
          "id": "11",
          "latexName": "cc",
          "parentId": "10",
          "alias": "cc",
          "componentName": "Filed"
        },
        "value": "cc"
      }
    }
  },
  "alternate": {
    "type": "BinaryExpression",
    "config": {
      "id": "12",
      "latexName": "Plus",
      "parentId": "1",
      "alias": "加",
      "componentName": "Binary",
      "data": {
        "operator": "+"
      }
    },
    "operator": "Plus",
    "left": {
      "type": "CallExpression",
      "config": {
        "id": "13",
        "latexName": "Last",
        "parentId": "12",
        "alias": "最后一个点",
        "componentName": "SingleContain"
      },
      "callee": "Last",
      "argument": {
        "type": "Literal",
        "config": {
          "id": "14",
          "latexName": "dd",
          "parentId": "13",
          "alias": "dd",
          "componentName": "Filed"
        },
        "value": "dd"
      }
    },
    "right": {
      "type": "NumberLiteral",
      "config": {
        "id": "16",
        "latexName": "1",
        "parentId": "15",
        "alias": "1",
        "componentName": "NumberFiled",
        "bracket": {
          "id": "15",
          "latexName": "Number",
          "parentId": "12",
          "alias": "数值",
          "componentName": "NumberContain"
        }
      },
      "value": "1"
    }
  }
}
defineOptions({
  name: "App",
});

function  decode(v:string) {
 console.log(v);
}
</script>









<template>
  <NDialogProvider>
    <NNotificationProvider>
      <NMessageProvider>
        <StoreContain v-slot="handleStore">
          <Latex />
          <br />
          <hr />
          <br />

          <NButton @click="
            handleStore.putActiveChildren('Number', '数值', 'NumberContain')
            ">
            Number
          </NButton>

          <NButton @click="
            handleStore.putActiveChildren('Count', '数据量', 'SingleContain')
            ">
            Count
          </NButton>
          <NButton @click="
            handleStore.putActiveChildren('Mean', '平均值', 'SingleContain')
            ">Mean</NButton>
          <NButton @click="
            handleStore.putActiveChildren('Median', '中位数', 'SingleContain')
            ">
            Median
          </NButton>
          <NButton @click="
            handleStore.putActiveChildren('Absolute', '绝对值', 'SingleContain')
            ">
            Absolute
          </NButton>
          <NButton @click="
            handleStore.putActiveChildren('Min', '最小值', 'SingleContain')
            ">Min</NButton>
          <NButton @click="
            handleStore.putActiveChildren('Max', '最大值', 'SingleContain')
            ">Max</NButton>
          <NButton @click="handleStore.putActiveChildren('Sum', '总和', 'SingleContain', {
            length: Infinity,
            breakCount: 5,
            dot: ','
          })">Sum</NButton>
          <NButton @click="
            handleStore.putActiveChildren(
              'First',
              '第一个点',
              'SingleContain'
            )
            ">First</NButton>
          <NButton @click="
            handleStore.putActiveChildren(
              'Last',
              '最后一个点',
              'SingleContain'
            )
            ">Last</NButton>
          <NButton @click="
            handleStore.putActiveChildren('Plus', '加', 'Binary', {
              operator: '+',
            })
            ">plus</NButton>
          <NButton @click="
            handleStore.putActiveChildren('Minus', '减', 'Binary', {
              operator: '-',
            })
            ">Minus</NButton>
          <NButton @click="
            handleStore.putActiveChildren('Times', '乘', 'Binary', {
              operator: '*',
            })
            ">Times</NButton>
          <NButton @click="
            handleStore.putActiveChildren('Div', '除', 'Binary', {
              operator: '{\\div}',
            })
            ">Div</NButton>
          <NButton @click="
            handleStore.putActiveChildren('Conditional', 'if', 'Conditional')
            ">Conditional</NButton>
          <NButton @click="handleStore.putActiveChildren('Bracket', '括号', 'Bracket')">Bracket</NButton>
          <NButton @click="decode(handleStore.encode())">encode</NButton>
          <NButton @click="handleStore.decode(a)">decode</NButton>
          <div>
            <NButton @click="
              handleStore.putActiveChildren('Eq', '==', 'Logical', {
                operator: '\\equiv',
              })
              ">Eq</NButton>
            <NButton @click="
              handleStore.putActiveChildren('NEq', '!=', 'Logical', {
                operator: '\\ne',
              })
              ">Neq</NButton>
            <NButton @click="handleStore.putActiveChildren('Gt', '>', 'Logical', {
              operator: '>',
            })">Gt</NButton>
            <NButton @click="handleStore.putActiveChildren('Lt', '<', 'Logical', {
              operator: '<',
            })">Lt</NButton>
            <NButton @click="handleStore.putActiveChildren('EGt', '>=', 'Logical', {
              operator: '\\ge',
            })">EGt</NButton>
            <NButton @click="handleStore.putActiveChildren('ELt', '<=', 'Logical', {
              operator: '\\le',
            })">ELt</NButton>
          </div>
          <br />
          <br />
          <hr />
          <br />
          <RootContain id="-1" alias="入口" />
        </StoreContain>
      </NMessageProvider>
    </NNotificationProvider>
  </NDialogProvider>
</template>














































<style lang="scss">
* {
  padding: 0;
  margin: 0;
}
</style>














































