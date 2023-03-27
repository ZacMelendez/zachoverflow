.PHONY: commit release component
GIT_TREE_STATE=$(shell (git status --porcelain | grep -q .) && echo dirty || echo clean)

component:
	@read -p "Enter component name: " component; \
	mkdir -p src/components/$$component; \
	sed -e "s/COMPONENT_NAME/$$component/g" ./templates/component.tsx > src/components/$$component/$$component.tsx; \
	echo "export { default as $$component } from './$$component/$$component';" >> src/components/index.ts; \
	sed -e "s/COMPONENT_NAME/$$component/g" ./templates/component.module.scss > src/components/$$component/$$component.module.scss; \

container:
	@read -p "Enter container name: " container; \
	mkdir -p src/containers/$$container; \
	sed -e "s/COMPONENT_NAME/$$container/g" ./templates/container.tsx > src/containers/$$container/$$container.tsx; \
	echo "export { default as $$container } from './$$container/$$container';" >> src/containers/index.ts; \
