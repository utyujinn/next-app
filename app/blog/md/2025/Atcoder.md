---
title: Atcoderメモ
date: 2025-03-20
tags:
  - c++
  - atcoder
---
## 変な時
- 同じ変数名を使っていないか、関数の中と外
- オーバーフローしていないか
- 配列の長さ、イZ#ンデックスは正しいか
- ループの回数は正しいか
- 配列外参照は起こっていないか
- 入力は正しいか
- index0,1を確かめたか
- 環境を誤っていないか(コンパイラ)
- 切り上げ、切り捨てを正しく扱ったか
- アルゴリズムを確認

## 高速化
```
ios::sync_with_stdio(false);
std::cin.tie(nullptr);
```
## 順列
```
    vector<int> a(n);
    for(int i = 0; i < n; i++){
        a[i] = i;
    }
    do {
	    
    }while(next_permutation(a.begin(),a.end()));
```
## 二分探索
```
    int ng = -1;
    int ok = n;
    while(ok-ng>1){
        int m = (ok+ng)/2;
        if(s[m]>=t[i])ok = m;
        else ng = m;
    }
```
## dfs
```
void dfs(vvi g,int v){
    d[v] = ++t;
    seen[v] = true;
    for(auto next_v : g[v]){
        if(seen[next_v])continue;
        else dfs(g,next_v);
    }
    f[v] = ++t;
}
```
## wfs
```
    vi dist(n+1,-1);
    queue<int> que;
    dist[1] = 0;
    que.push(1);

    while(!que.empty()){
        int v = que.front();
        que.pop();
        for(int nv:g[v]){
            if(dist[nv]!=-1)continue;
            else{
                dist[nv] = dist[v]+1;
                que.push(nv);
            }
        }
    }
```

## dijkstra
```
priority_queue<pair<long,long>, vector<pair<long,long>>, greater<>> pq;
	pq.emplace(0,r);
	dist[r] = 0;
	while(!pq.empty()){
		pair<long,long> c = pq.top();
		pq.pop();
		if(dist[c.second]<c.first)continue;
		for(auto n: G[c.second]){
			int tmp = c.first + n.second;
			if(dist[n.first] > c.first + n.second){
				dist[n.first] = c.first + n.second;
				pq.emplace(c.first+n.second, n.first);
			}
		}
	}
```

## ワーシャルフロイド
```
    rep(k,n){
        rep(i,n){
            rep(j,n){
                if(dist[i][k] == inf || dist[k][j] == inf)continue;
                dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
                if(dist[i][i]<0){
                    cout << "NEGATIVE CYCLE" << endl;
                    return 0;
                }
            }
        }
    }
```
## modpow
```
long modpow(long a, long b, long mod){
	long res = 1;
	for(int i = 0; i < 31; i++){
		if((b>>i)%2 == 1)res = (res*a)%mod;
		a = (a*a)%mod;
	}
	return res;
}
```

## 組み合わせnCr
```
    vl fac(n+1),finv(np+1),inv(n+1);
    fac[0] = fac[1] = 1;
    finv[0] = finv[1] = 1;
    inv[1] = 1;
    for(int i = 2; i <= n; i++){
        fac[i] = fac[i-1] * i % MOD;
        inv[i] = MOD - inv[MOD%i] * (MOD / i) % MOD;
        finv[i] = finv[i - 1] * inv[i] % MOD;
    }
    ll ans = fac[n] * finv[r] %MOD * finv[n-r] %MOD;
```

## gcd
最大公約数
ax+by=gcd(a,b)
```
template<T>
T gcd(T a, T b){
    if(b==0)return a;
    else return gcd(b,a%b);
}

template<typename T>
T egcd(T a, T b, T &x, T &y){
        if(b==0){
                x=1;
                y=0;
                return a;
        }
        else{
                long d = egcd(b,a%b,y,x);
                y -= a/b*x;
                return d;
        }
}
```
## UnionFind
```
struct UnionFind{
	int N;
	vector<int> size, parent;
	UnionFind(int _n): N(_n),size(_n, 1),parent(_n, -1){}
	int root(int x){
		if(parent[x] == -1)return x;
		else return root(parent[x]);
	}
	bool same(int x,int y){
		return root(x) == root(y);
	}
	void unite(int x,int y){
		if(same(x,y))return;
		int rx = root(x), ry = root(y);
		if(size[rx] > size[ry]){
			parent[ry] = rx;
			size[rx] += size[ry];
		}
		else{
			parent[rx] = ry;
			size[ry] += size[rx];
		}
		return;
	}
	void clear(){
		for(int i=0;i<N;i++){
			size[i]=1;
			parent[i]=-1;
		}
	}
};
```

## BIT
```
struct BIT{
  int n;
  vector<long> bit[2];
  BIT(int _n) : n(_n+1){
    for(int p=0;p<2;p++){
      bit[p].assign(n,0);
    }
  }
  void add_sub(int p, int i, int x){
    i++;
    for(int idx=i;idx<=n;idx+=idx&(-idx)){
      bit[p][idx-1]+=x;
    }
  }
  void add(int i,int x){
    add_sub(0,i,x);
  }
  void add_range(int l,int r,int x){
    add_sub(0,l,-x*(l-1));
    add_sub(0,r,x*(r-1));
    add_sub(1,l,x);
    add_sub(1,r,-x);
  }
  long sum_sub(int p,int i){
    long s=0;
    i++;
    for(int idx=i;idx>0;idx-=idx&(-idx)){
      s+=bit[p][idx-1];
    }
    return s;
  }
  long sum(int i){
  	return sum_sub(0,i)+i*sum_sub(1,i);
  }
	long sum(int l,int r){
		return sum(r-1)-sum(l-1);
	}
  int get(int i){
    return sum(i)-sum(i-1);
  }
};
```

## segtree
```
struct RMQ{
	int N;
	vector<int> data,lazy;
	RMQ(int _N){
		int a=1;
		while(a<_N)a<<=1;
		N=a;
		data.assign(N*2,~0U>>1);
		lazy.assign(N*2,~0U>>1);
	}
	void eval(int k){
		if(lazy[k]==~0U>>1)return;
		if(k<N){
			lazy[k*2]=lazy[k];
			lazy[k*2+1]=lazy[k];
		}
		data[k]=lazy[k];
		lazy[k]=~0U>>1;
	}
	void update_sub(int l,int r,int x,int k,int al,int ar){
		eval(k);
		if(l>=ar||r<=al)return;
		else if(l<=al&&ar<=r){
			lazy[k]=x;
			eval(k);
		}
		else{
			update_sub(l,r,x,k*2,al,(al+ar)/2);
			update_sub(l,r,x,k*2+1,(al+ar)/2,ar);
			data[k]=min(data[k*2],data[k*2+1]);
		}
	}
	void update(int l,int r,int x){
		update_sub(l,r,x,1,0,N);
	}
	int find_sub(int l,int r,int k,int al,int ar){
		eval(k);
		if(l>=ar||r<=al)return ~0U>>1;
		else if(l<=al&&ar<=r){
			return data[k];
		}
		else{
			int gl=find_sub(l,r,k*2,al,(al+ar)/2);
			int gr=find_sub(l,r,k*2+1,(al+ar)/2,ar);
			return min(gl,gr);
		}
	}
	int find(int l,int r){
		return find_sub(l,r,1,0,N);
	}
	void print(){
		for(int i=0;i<2*N;i++){
			cout<<data[i]<<(i==N*2-1?"\n":" ");
		}
	}
};
```

## ダブリング
```
while(1<<a < n){
    a++;
}
vector<vector<int>> parent(n,vector<int>(a,-1));
    for(int i = 0 ;i < n; i++){
        cin >> k;
        for(;k--;){
            cin >> c;
            G[i].push_back(c);
            parent[c][0] = i;
        }
    }
    for(int j = 1; j < a; j++){
	    for(int i = 0; i < n; i++){
            if(parent[i][j-1] >= 0)
                parent[i][j] = parent[parent[i][j-1]][j-1];
        }
    }
```

## Grundy

## struct
- set
```
a.insert(b);
a.erase(b);
a.count(b);
a.size();
```
- map
```
a.insert(b);
a.erase(b);
a.count(b);
a.size();
a.find();
```
- queue
```
q.push(a);
q.front(a);
q.pop();
```
- vector
```
a.erase(unique(a.begin(), a.end()), a.end());
```
- stack
```
a.push(b);
a.pop();
a.top();
```
- 実数
```
#include<iomanip>
cout<<fixed<<setprecision(15)<<hoge<<endl;
```


## Matrix行列
```
template<typename T>
struct Matrix {
	T rows;
	T cols;
	vector<vector<T> > data;

	Matrix(T r,T c):rows(r),cols(c),data(r,vector<T>(c)){}

	vector<T>& operator[](int index){
		return data[index];
	}
	const vector<T>& operator[](int index) const{
		return data[index];
	}

	Matrix operator*(const Matrix& other) const{
		Matrix result(rows, other.cols);
		for(int i=0;i<rows;i++){
			for(int j=0;j<other.cols;j++){
				for(int k=0;k<cols;k++){
					result[i][j]+=data[i][k]*other[k][j];
					//result[i][j]%=mod;
				}
			}
		}
		return result;
	}

	Matrix pow(long K) const{
		Matrix result(rows, rows);
		for(int i=0;i<rows;i++)result[i][i]=1;
		Matrix tmp(rows,rows);
		for(int i=0;i<rows;i++)for(int j=0;j<cols;j++)tmp[i][j]=data[i][j];
		while(K){
			if(K%2)result=result*tmp;
			tmp=tmp*tmp;
			K/=2;
		}
		return result;
	}

	void print(){
		for(int i=0;i<rows;i++){
			for(int j=0;j<cols;j++){
				cout<<data[i][j]<<" ";
			}
			cout<<endl;
		}
	}
};
```

## modint
```
template<int mod>
struct ModInt{
	int val;
	ModInt():val(0){}
	ModInt(long long x):val(x>=0?x%mod:(mod-(-x)%mod)%mod){}
	ModInt &operator+=(const ModInt &p){
		if((val+=p.val)>=mod){
			val-=mod;
		}
		return *this;
	}
	ModInt &operator-=(const ModInt &p){
		if((val+=mod-p.val)>=mod){
			val-=mod;
		}
		return *this;
	}
	ModInt &operator*=(const ModInt &p){
		val=(int)(1LL*val*p.val%mod);
		return *this;
	}
	ModInt &operator/=(const ModInt &p){
		*this *= p.inverse();
		return *this;
	}
	ModInt operator-() const { return ModInt(-val);}
	ModInt operator+(const ModInt &p) const{return ModInt(*this)+=p;}
	ModInt operator-(const ModInt &p) const{return ModInt(*this)-=p;}
	ModInt operator*(const ModInt &p) const{return ModInt(*this)*=p;}
	ModInt operator/(const ModInt &p) const{return ModInt(*this)/=p;}
	bool operator==(const ModInt &p)const{return val==p.val;}
	bool operator!=(const ModInt &p)const{return val!=p.val;}
	ModInt inverse() const{
		int a=val, b=mod, u=1,v=0,t;
		while(b>0){
			t=a/b;
			swap(a-=t*b,b);
			swap(u-=t*v,v);
		}
		return ModInt(u);
	}
	ModInt pow(long long n)const{
		ModInt ret(1), mul(val);
		while(n>0){
			if(n&1)ret*=mul;
			mul*=mul;
			n>>=1;
		}
		return ret;
	}
	friend ostream &operator<<(ostream &os, const ModInt &p) {return os<<p.val;}
	friend istream &operator>>(istream &is, ModInt &a){
		long long t;
		is>>t;
		a=ModInt<mod>(t);
		return (is);
	}
	int get_mod(){return mod;}
};
const int MOD = 998244353;
using modint = ModInt<MOD>;
```

## 組み合わせnCk
```
template<class T>
struct Comb {
	vector<T> fact_, fact_inv_, inv_;
	Comb(int SIZE):fact_(SIZE, 1), fact_inv_(SIZE,1), inv_(SIZE, 1) {init(SIZE);}
	void init(int SIZE){
		fact_.assign(SIZE, 1), fact_inv_.assign(SIZE,1), inv_.assign(SIZE, 1);
		int mod=fact_[0].get_mod();
		for(int i=2;i<SIZE;i++){
			fact_[i]=fact_[i-1]*i;
			inv_[i]=-inv_[mod%i]*(mod/i);
			fact_inv_[i]=fact_inv_[i-1]*inv_[i];
		}
	}
	T nCk(int n, int k){
		return fact_[n]*fact_inv_[k]*fact_inv_[n-k];
	}
	T nHk(int n, int k){
		return nCk(n+k-1,k);
	}
	T fact(int n){
		return fact_[n];
	}
	T fact_iinv(int n){
		return fact_inv_[n];
	}
	T inv(int n){
		return inv_[n];
	}
};
Comb<modint> comb(2<<17);

```

## 全方位木DP
```
using Graph = vector<vector<int>>;

template<class Monoid> struct ReRooting{
	using MergeFunc=function<Monoid(Monoid, Monoid)>;
	using AddNodeFunc = function<Monoid(int, Monoid)>;

	Graph G;
	Monoid IDENTITY;
	MergeFunc MERGE;
	AddNodeFunc ADDNODE;

	vector<vector<Monoid>> dp;

	ReRooting(const Graph &g, const Monoid &identity, const MergeFunc &merge, const AddNodeFunc &addnode){
		G=g;
		IDENTITY=identity;
		MERGE=merge;
		ADDNODE=addnode;
		build();
	}

	Monoid rec(int v, int p){
		Monoid res=IDENTITY;
		dp[v].assign(G[v].size(), IDENTITY);
		for(int i=0;i<G[v].size();i++){
			int n=G[v][i];
			if(n!=p){
				dp[v][i]=rec(n,v);
				res=MERGE(res, dp[v][i]);
			}
		}
		return ADDNODE(v, res);
	}
	void rerec(int v, int p, Monoid pval){
		for(int i=0;i<G[v].size();i++){
			int v2=G[v][i];
			if(v2==p){
				dp[v][i]=pval;
			}
		}
		vector<Monoid> left(G[v].size(), IDENTITY);
		vector<Monoid> right(G[v].size(), IDENTITY);
		for(int i=1;i<G[v].size();i++){
			left[i]=MERGE(left[i-1], dp[v][i-1]);
			right[i]=MERGE(right[i-1],dp[v][(int)G[v].size()-i]);
		}
		for(int i=0;i<G[v].size();i++){
			int n=G[v][i];
			if(n!=p){
				Monoid pval2=MERGE(left[i], right[(int)G[v].size()-i-1]);
				rerec(n,v,ADDNODE(v, pval2));
			}
		}
	}
	void build(){
		dp.assign(G.size(), vector<Monoid>());
		int root=0, nullparent=01;
		rec(root,nullparent);
		rerec(root, nullparent, IDENTITY);
	}
	Monoid get(int v){
		Monoid res=IDENTITY;
		for(int i=0;i<G[v].size();i++){
			res = MERGE(res, dp[v][i]);
		}
		return ADDNODE(v,res);
	}
};
```

## 並列二分探索
```
#include<iostream>
#include<vector>
#include<unordered_set>
using namespace std;
int N,M,Q;
int ok[1<<17],ng[1<<17];
vector<int> mid[2<<17];

	for(int i=0;i<Q;i++){
		ok[i]=M+1;
		ng[i]=-1;
		mid[(ok[i]+ng[i])/2].push_back(i);
	}
	while(true){
		for(int m=0;m<=M;m++){
			for(int id:mid[m]){
				if(uf.same(x[id],y[id])){
					ok[id]=m;
				}else{
					ng[id]=m;
				}
			}
			//m回目のシミュレーション
		}
		for(int m=0;m<=M;m++){
			mid[m].clear();
		}
		bool flag=true;
		for(int id=0;id<Q;id++){
			mid[(ok[id]+ng[id])/2].push_back(id);
			if(ok[id]-ng[id]>1)flag=false;
		}
		if(flag)break;
		//シミュレーションのリセット
	}
```

## ハッシュ生成
```
#include<random>
int hs[2<<17];
int MOD = 998244353;

void make_hash(){
	random_device seed_gen;
	default_random_engine engine(seed_gen());
	uniform_int_distribution<> dist(1,MOD);
	for(int i=0;i<(2<<17);i++){
		hs[i]=dist(engine);
	}
}
```
## 移動
- 上下左右　
```
int d[5]={0,1,0,-1};
```
- 斜め
```
int d[5]={1,1,-1,-1,1};
```
- 上下左右斜め
```
int d[9]={1,0,-1,0,1,1,-1,-1,1};
```
