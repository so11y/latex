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
  "type": "BinaryExpression",
  "config": {
    "id": "t8rx7l1kz0o_1702110495894",
    "latexName": "Div",
    "parentId": "-1",
    "alias": "除",
    "componentName": "Binary",
    "data": {
      "operator": "{\\div}"
    }
  },
  "operator": "Div",
  "left": {
    "type": "CallExpression",
    "config": {
      "id": "tg6wn1wkqhl_1702110501440",
      "latexName": "Count",
      "parentId": "t8rx7l1kz0o_1702110495894",
      "alias": "数据量",
      "componentName": "SingleContain"
    },
    "callee": "Count",
    "argument": {
      "type": "Literal",
      "config": {
        "id": "rrjhl5ovtal_1702110505413",
        "latexName": "nn",
        "parentId": "tg6wn1wkqhl_1702110501440",
        "alias": "nn",
        "componentName": "Filed"
      },
      "value": "nn"
    }
  },
  "right": {
    "type": "BinaryExpression",
    "config": {
      "id": "8cmcsrul6g3_1702110532763",
      "latexName": "Minus",
      "parentId": "t8rx7l1kz0o_1702110495894",
      "alias": "减",
      "componentName": "Binary",
      "data": {
        "operator": "-"
      }
    },
    "operator": "Minus",
    "left": {
      "type": "NumberLiteral",
      "config": {
        "id": "dbcu4czeur9_1702110538590",
        "latexName": "10",
        "parentId": "jw8quca1jg_1702110535611",
        "alias": "10",
        "componentName": "NumberFiled",
        "bracket": {
          "id": "jw8quca1jg_1702110535611",
          "latexName": "Number",
          "parentId": "8cmcsrul6g3_1702110532763",
          "alias": "数值",
          "componentName": "NumberContain"
        }
      },
      "value": "10"
    },
    "right": {
      "type": "BinaryExpression",
      "config": {
        "id": "ffy4e6metfa_1702110557152",
        "latexName": "Plus",
        "parentId": "rdpyrod4sx_1702110542131",
        "alias": "加",
        "componentName": "Binary",
        "data": {
          "operator": "+"
        },
        "bracket": {
          "id": "rdpyrod4sx_1702110542131",
          "latexName": "Bracket",
          "parentId": "8cmcsrul6g3_1702110532763",
          "alias": "括号",
          "componentName": "Bracket"
        }
      },
      "operator": "Plus",
      "left": {
        "type": "NumberLiteral",
        "config": {
          "id": "p7ommnsyyeq_1702110560378",
          "latexName": "1",
          "parentId": "gb5m9pv2jnn_1702110558470",
          "alias": "1",
          "componentName": "NumberFiled",
          "bracket": {
            "id": "gb5m9pv2jnn_1702110558470",
            "latexName": "Number",
            "parentId": "ffy4e6metfa_1702110557152",
            "alias": "数值",
            "componentName": "NumberContain"
          }
        },
        "value": "1"
      },
      "right": {
        "type": "NumberLiteral",
        "config": {
          "id": "yjtghwt37al_1702110564268",
          "latexName": "2",
          "parentId": "4a0pz85j52q_1702110561708",
          "alias": "2",
          "componentName": "NumberFiled",
          "bracket": {
            "id": "4a0pz85j52q_1702110561708",
            "latexName": "Number",
            "parentId": "ffy4e6metfa_1702110557152",
            "alias": "数值",
            "componentName": "NumberContain"
          }
        },
        "value": "2"
      }
    }
  }
}
defineOptions({
  name: "App",
});
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
          <NButton @click="handleStore.encode()">encode</NButton>
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














































